import { describe, expect, it } from "vitest";
import { normalizeMetaWebhook } from "../src/meta/webhook";

describe("normalizeMetaWebhook", () => {
  it("rejects non-Instagram payloads and tolerates malformed collections", () => {
    expect(normalizeMetaWebhook({ object: "page", entry: [] }, "ig-account-id")).toEqual([]);
    expect(normalizeMetaWebhook({ object: "instagram", entry: "invalid" }, "ig-account-id")).toEqual([]);
    expect(normalizeMetaWebhook(null)).toEqual([]);
  });

  it("normalizes a comment webhook", () => {
    const events = normalizeMetaWebhook(
      {
        object: "instagram",
        entry: [
          {
            id: "ig-account-id",
            changes: [
              {
                field: "comments",
                value: {
                  id: "comment-1",
                  text: "PROMPT please",
                  media: { id: "media-1" },
                  from: { id: "user-1", username: "testuser" }
                }
              }
            ]
          }
        ]
      },
      "ig-account-id"
    );

    expect(events).toEqual([
      {
        type: "comment.created",
        eventId: "comment:comment-1",
        commentId: "comment-1",
        mediaId: "media-1",
        igUserId: "user-1",
        username: "testuser",
        text: "PROMPT please",
        createdAt: undefined
      }
    ]);
  });

  it("normalizes a postback webhook", () => {
    const events = normalizeMetaWebhook(
      {
        object: "instagram",
        entry: [
          {
            id: "ig-account-id",
            messaging: [
              {
                sender: { id: "user-1" },
                recipient: { id: "ig-account-id" },
                timestamp: 1,
                postback: { payload: "campaign-1:confirm" }
              }
            ]
          }
        ]
      },
      "ig-account-id"
    );

    expect(events).toEqual([
      {
        type: "message.postback",
        eventId: "postback:user-1:1",
        igUserId: "user-1",
        payload: "campaign-1:confirm"
      }
    ]);
  });

  it("normalizes a quick reply as a postback event", () => {
    const events = normalizeMetaWebhook(
      {
        object: "instagram",
        entry: [
          {
            id: "ig-account-id",
            messaging: [
              {
                sender: { id: "user-1" },
                recipient: { id: "ig-account-id" },
                timestamp: 2,
                message: { quick_reply: { payload: "campaign-1:confirm" } }
              }
            ]
          }
        ]
      },
      "ig-account-id"
    );

    expect(events).toEqual([
      {
        type: "message.postback",
        eventId: "postback:user-1:2",
        igUserId: "user-1",
        payload: "campaign-1:confirm"
      }
    ]);
  });

  it("normalizes a READY text message", () => {
    const events = normalizeMetaWebhook(
      {
        object: "instagram",
        entry: [
          {
            id: "ig-account-id",
            messaging: [
              {
                sender: { id: "user-1" },
                recipient: { id: "ig-account-id" },
                timestamp: 3,
                message: { text: "READY" }
              }
            ]
          }
        ]
      },
      "ig-account-id"
    );

    expect(events).toEqual([
      {
        type: "message.text",
        eventId: "message:user-1:3",
        igUserId: "user-1",
        text: "READY"
      }
    ]);
  });

  it("accepts Instagram messaging events when the recipient id differs from the entry account id", () => {
    const events = normalizeMetaWebhook(
      {
        object: "instagram",
        entry: [
          {
            id: "ig-account-id",
            messaging: [
              {
                sender: { id: "user-1" },
                recipient: { id: "alternate-recipient-id" },
                timestamp: 4,
                message: { text: "TEMBOK" }
              }
            ]
          }
        ]
      },
      "ig-account-id"
    );

    expect(events).toEqual([
      {
        type: "message.text",
        eventId: "message:user-1:4",
        igUserId: "user-1",
        text: "TEMBOK"
      }
    ]);
  });

  it("accepts Instagram messaging events when the entry id differs from the configured comment account id", () => {
    const events = normalizeMetaWebhook(
      {
        object: "instagram",
        entry: [
          {
            id: "messaging-scoped-id",
            messaging: [
              {
                sender: { id: "user-1" },
                recipient: { id: "alternate-recipient-id" },
                timestamp: 5,
                postback: { payload: "campaign-1:confirm" }
              }
            ]
          }
        ]
      },
      "ig-account-id"
    );

    expect(events).toEqual([
      {
        type: "message.postback",
        eventId: "postback:user-1:5",
        igUserId: "user-1",
        payload: "campaign-1:confirm"
      }
    ]);
  });

  it("accepts Instagram messaging events when the entry or recipient id is explicitly allowlisted", () => {
    const events = normalizeMetaWebhook(
      {
        object: "instagram",
        entry: [
          {
            id: "messaging-scoped-id",
            messaging: [
              {
                sender: { id: "user-1" },
                recipient: { id: "alternate-recipient-id" },
                timestamp: 5,
                postback: { payload: "campaign-1:confirm" }
              }
            ]
          }
        ]
      },
      "ig-account-id",
      ["messaging-scoped-id", "alternate-recipient-id"]
    );

    expect(events).toEqual([
      {
        type: "message.postback",
        eventId: "postback:user-1:5",
        igUserId: "user-1",
        payload: "campaign-1:confirm"
      }
    ]);
  });

  it("drops Instagram messaging events outside a configured messaging allowlist", () => {
    const events = normalizeMetaWebhook(
      {
        object: "instagram",
        entry: [
          {
            id: "other-account-id",
            messaging: [
              {
                sender: { id: "user-1" },
                recipient: { id: "other-recipient-id" },
                timestamp: 6,
                postback: { payload: "campaign-1:confirm" }
              }
            ]
          }
        ]
      },
      "ig-account-id",
      ["messaging-scoped-id"]
    );

    expect(events).toEqual([]);
  });

  it("drops events that are not scoped to the configured Instagram account", () => {
    const events = normalizeMetaWebhook(
      {
        object: "instagram",
        entry: [
          {
            id: "other-account-id",
            changes: [
              {
                field: "comments",
                value: {
                  id: "comment-1",
                  text: "PROMPT",
                  media: { id: "media-1" },
                  from: { id: "user-1" }
                }
              }
            ]
          }
        ]
      },
      "ig-account-id"
    );

    expect(events).toEqual([]);
  });

  it("does not include raw inbound DM text in durable event IDs", () => {
    const events = normalizeMetaWebhook(
      {
        object: "instagram",
        entry: [
          {
            id: "ig-account-id",
            messaging: [
              {
                sender: { id: "user-1" },
                recipient: { id: "ig-account-id" },
                timestamp: 4,
                message: { text: "READY with private text" }
              }
            ]
          }
        ]
      },
      "ig-account-id"
    );

    expect(events[0]?.eventId).toBe("message:user-1:4");
    expect(events[0]?.eventId).not.toContain("READY");
    expect(events[0]?.eventId).not.toContain("private");
  });

  it("drops incomplete and unrelated comment or messaging events", () => {
    const events = normalizeMetaWebhook({
      object: "instagram",
      entry: [
        {
          id: "ig-account-id",
          changes: [
            { field: "likes", value: {} },
            { field: "comments", value: { id: "", media: { id: "media-1" }, from: { id: "user-1" } } }
          ],
          messaging: [
            { sender: {}, timestamp: 1, message: { text: "ignored" } },
            { sender: { id: "user-1" }, timestamp: "", message: { text: "ignored" } },
            { sender: { id: "user-1" }, timestamp: 2, message: {} }
          ]
        }
      ]
    });

    expect(events).toEqual([]);
  });

  it("normalizes unscoped events with missing optional fields and a created time", () => {
    const events = normalizeMetaWebhook({
      object: "instagram",
      entry: [
        {
          changes: [
            {
              field: "comments",
              value: {
                id: "comment-2",
                created_time: 456,
                media: { id: "media-2" },
                from: { id: "user-2" }
              }
            },
            { field: "comments", value: { media: { id: "media-2" }, from: { id: "user-2" } } },
            { field: "comments", value: { id: "comment-3", from: { id: "user-2" } } },
            { field: "comments", value: { id: "comment-4", media: { id: "media-2" } } }
          ],
          messaging: [
            { sender: { id: "user-3" }, timestamp: 7, message: { text: "hello" } },
            { sender: { id: "user-4" }, message: { text: "ignored" } }
          ]
        }
      ]
    });

    expect(events).toEqual([
      {
        type: "comment.created",
        eventId: "comment:comment-2",
        commentId: "comment-2",
        mediaId: "media-2",
        igUserId: "user-2",
        username: undefined,
        text: "",
        createdAt: "456"
      },
      {
        type: "message.text",
        eventId: "message:user-3:7",
        igUserId: "user-3",
        text: "hello"
      }
    ]);
  });

  it("uses supplied message ids, timestamps, and safely truncates external strings", () => {
    const longText = "x".repeat(1_100);
    const longPayload = "p".repeat(250);
    const longUsername = "u".repeat(100);
    const events = normalizeMetaWebhook({
      object: "instagram",
      entry: [
        {
          id: "ig-account-id",
          changes: [
            {
              field: "comments",
              value: {
                id: "comment-1",
                text: longText,
                timestamp: 123,
                media: { id: "media-1" },
                from: { id: "user-1", username: longUsername }
              }
            }
          ],
          messaging: [
            {
              sender: { id: "user-2" },
              timestamp: 2,
              postback: { mid: "postback-mid", payload: longPayload }
            },
            {
              sender: { id: "user-3" },
              timestamp: 3,
              message: { mid: "message-mid", text: longText }
            }
          ]
        }
      ]
    });

    expect(events).toHaveLength(3);
    expect(events[0]).toMatchObject({ createdAt: "123", text: "x".repeat(1_000), username: "u".repeat(80) });
    expect(events[1]).toMatchObject({ eventId: "postback:user-2:postback-mid", payload: "p".repeat(200) });
    expect(events[2]).toMatchObject({ eventId: "message:user-3:message-mid", text: "x".repeat(1_000) });
  });
});
