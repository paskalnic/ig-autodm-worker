from pathlib import Path
import re
import sys

path = Path(sys.argv[1] if len(sys.argv) > 1 else "src/admin/ui.ts")
if not path.exists():
    raise SystemExit(f"Fichier introuvable: {path}")

text = path.read_text(encoding="utf-8")
original = text

replacements = {
    "Mot de passe akun operator.": "Mot de passe du compte administrateur.",
    "Error: <strong id=\"readinessError\">tidak ada</strong>": "Erreur : <strong id=\"readinessError\">aucune</strong>",
    "Sélectionner une campagne yang sudah ada, atau buat campaign baru.": "Sélectionnez une campagne existante ou créez-en une nouvelle.",
    "Buka daftar post atau klik Actualiser post.": "Ouvrez la liste des publications ou cliquez sur Actualiser.",
    "Contoh: Blue Green Guide": "Exemple : Défi Ki’Savan",
    "Prompt-nya sudah prêt. Tekan tombol di bawah ini.": "Ton contenu est prêt. Appuie sur le bouton ci-dessous.",
    "Kalau user belum follow saat tombol diklik, DM akan minta follow dulu dan menampilkan tombol retry. Balasan READY tetap jadi fallback.": "Si la personne ne suit pas encore le compte lorsqu’elle clique, le DM lui demandera de s’abonner puis affichera un bouton pour réessayer. La réponse PRÊT reste disponible en secours.",
    "Teks saat belum follow": "Message si la personne n’est pas abonnée",
    "Follow dulu akun ini, lalu tap tombol ini lagi. Kalau tombolnya tidak muncul, réponds PRÊT.": "Abonne-toi d’abord à ce compte, puis appuie de nouveau sur ce bouton. Si le bouton n’apparaît pas, réponds PRÊT.",
    "Facultatif. Kosong berarti pakai teks default otomatis sesuai nama tombol.": "Facultatif. Laissez vide pour utiliser automatiquement le message par défaut correspondant au bouton.",
    "Tombol saat belum follow": "Bouton si la personne n’est pas abonnée",
    "UDAH FOLLOW": "JE SUIS ABONNÉ",
    "Facultatif. Kosong berarti tombol retry memakai tombol Premier message privé.": "Facultatif. Laissez vide pour réutiliser le bouton du premier message privé.",
    "Gunakan beberapa versi agar pesan tidak selalu sama.": "Utilisez plusieurs versions pour varier les messages.",
    "Variasi Premier message privé": "Variantes du premier message privé",
    "Prompt-nya sudah prêt, tekan tombol di bawah ya&#10;Prompt sudah prêt. Lanjut lewat tombol ini.": "Ton contenu est prêt, appuie sur le bouton ci-dessous.&#10;C’est prêt. Continue avec ce bouton.",
    "Satu variasi per baris. Premier message privé utama tetap ikut sebagai variasi.": "Une variante par ligne. Le premier message principal reste inclus dans la rotation.",
    "Klik template untuk menambahkannya ke variasi. Campagnes tetap perlu disimpan.": "Cliquez sur un modèle pour l’ajouter aux variantes. Vous devrez ensuite enregistrer la campagne.",
    "Facultatif. Tanpa langkah tambahan, tombol pertama langsung mengirim prompt/link akhir.": "Facultatif. Sans étape supplémentaire, le premier bouton envoie directement le message ou le lien final.",
    "Gunakan jika user perlu melewati beberapa tombol sebelum menerima prompt/link akhir. Maksimal 3 langkah tambahan.": "Utilisez cette option si la personne doit passer par plusieurs boutons avant de recevoir le message ou le lien final. Maximum : 3 étapes supplémentaires.",
    "Tempel link Notion atau isi prompt lengkap di sini.": "Collez ici le lien ou le contenu final.",
    "Isi utama yang diterima user di akhir alur DM.": "Contenu principal reçu à la fin du parcours en message privé.",
    "Muncul sebagai reply di komentar setelah Premier message privé terkirim. Kosongkan kalau tidak mau balasan publik.": "Cette réponse apparaît sous le commentaire après l’envoi du premier message privé. Laissez vide pour ne pas répondre publiquement.",
    "Cek DM kamu ya": "Regarde tes messages privés 📩",
    "Facultatif. Berguna untuk memberi tahu user bahwa DM sudah dikirim. Maksimal 300 karakter.": "Facultatif. Permet d’indiquer que le message privé a été envoyé. Maximum : 300 caractères.",
    "Balasan kalau DM gagal": "Réponse si l’envoi du message privé échoue",
    "DM kamu belum bisa kami kirim. Buka izin DM, lalu komen PROMPT lagi sebagai komentar baru.": "Nous n’avons pas pu t’envoyer de message privé. Autorise les demandes de messages, puis publie à nouveau le mot-clé dans un nouveau commentaire.",
    "Facultatif. Dikirim sebagai public reply kalau Premier message privé ditolak karena user belum bisa menerima pesan.": "Facultatif. Publiée en réponse au commentaire si Instagram refuse le premier message privé.",
    "Gunakan beberapa versi agar balasan komentar terasa lebih natural.": "Utilisez plusieurs versions pour rendre les réponses publiques plus naturelles.",
    "Variasi balasan publik": "Variantes de réponse publique",
    "Udah gue kirim ke DM&#10;Masuk DM ya&#10;Beres, cek DM kamu": "C’est envoyé en message privé 📩&#10;Regarde tes messages privés 👋&#10;C’est prêt, vérifie tes messages privés.",
    "Satu variasi per baris. Balasan utama tetap ikut sebagai variasi.": "Une variante par ligne. La réponse principale reste incluse dans la rotation.",
    "Terisi otomatis dari post yang dipilih. Bisa ditempel manual jika daftar post gagal dimuat.": "Renseigné automatiquement à partir de la publication sélectionnée. Vous pouvez aussi coller l’identifiant manuellement si la liste ne se charge pas.",
    "ID campaign": "Identifiant de campagne",
    "Dibuat otomatis. Ubah hanya kalau kamu butuh ID tertentu.": "Créé automatiquement. Modifiez-le uniquement si vous avez besoin d’un identifiant précis.",
    "Kode tombol": "Code du bouton",
    "Dibuat otomatis untuk mengenali tombol yang diklik user.": "Créé automatiquement pour identifier le bouton utilisé.",
    "Premier message privé + tombol": "Premier message privé + bouton",
    "Mot ou expression déclencheur belum diisi.": "Mot ou expression déclencheur non renseigné.",
    "Facultatif. Kosong berarti tidak membalas komentar publik.": "Facultatif. Laissez vide pour ne pas répondre publiquement.",
    "Premier message privé belum diisi.": "Premier message privé non renseigné.",
    "Message ou lien final belum diisi.": "Message ou lien final non renseigné.",
    "Campagnes dipilih": "Campagne sélectionnée",
    ">kosong<": ">aucune<",
    "Identifiant, password, dan security key wajib diisi.": "L’identifiant, le mot de passe et la clé de sécurité sont obligatoires.",
    "Selesaikan verifikasi keamanan dulu": "Terminez d’abord la vérification de sécurité.",
    "Login gagal": "Échec de la connexion",
    "Akses gagal": "Échec de l’accès",
    "Login admin belum aktif": "La session administrateur n’est pas active",
    "Sesi login berakhir. Silakan masuk lagi.": "Votre session a expiré. Connectez-vous à nouveau.",
    "memuat ulang data": "recharger les données",
    "Data gagal dimuat ulang.": "Impossible de recharger les données.",
    'token.lastError || "tidak ada"': 'token.lastError || "aucune"',
    "Belum ada campaign. Klik Buat campaign.": "Aucune campagne. Cliquez sur Créer une campagne.",
    'campaign.enabled ? "aktif" : "draft"': 'campaign.enabled ? "active" : "brouillon"',
    'campaign.keyword ? "Mot-clé: " + campaign.keyword : "Mot-clé belum diisi"': 'campaign.keyword ? "Mot-clé : " + campaign.keyword : "Mot-clé non renseigné"',
    "Post gagal dimuat": "Impossible de charger les publications",
    "Instagram media fetch failed": "Échec de récupération des publications Instagram",
    "Pakai post ini": "Utiliser cette publication",
    "Lihat di Instagram": "Voir sur Instagram",
    "Dipilih:": "Sélectionnée :",
    "Campagnes hanya berjalan di post ini, bukan semua post Instagram.": "La campagne fonctionne uniquement sur cette publication, pas sur toutes les publications Instagram.",
    "Edit campaign": "Modifier la campagne",
    "Simpan perubahan": "Enregistrer les modifications",
    "Campagnes aktif": "Campagne active",
    "Aktif: perubahan tersimpan dipakai untuk komentar berikutnya.": "Active : les modifications enregistrées s’appliqueront aux prochains commentaires.",
    "Perubahan mulai berlaku setelah disimpan. Buka Post yang diawasi untuk mengganti target post.": "Les modifications prennent effet après l’enregistrement. Ouvrez la publication surveillée pour changer de publication cible.",
    "siap": "prêt",
    "ID campaign wajib diisi.": "L’identifiant de campagne est obligatoire.",
    "Campagnes ini sedang aktif. Perubahan akan mulai berlaku setelah disimpan. Lanjutkan?": "Cette campagne est active. Les changements prendront effet après l’enregistrement. Continuer ?",
    "Tersimpan": "Enregistré",
    "tersimpan": "enregistré",
    "Tersimpan dan aktif.": "Enregistrée et active.",
    "Tersimpan sebagai draft. Campagnes belum merespons komentar sampai diaktifkan.": "Enregistrée comme brouillon. La campagne ne répondra pas aux commentaires tant qu’elle ne sera pas activée.",
    "Campagnes gagal disimpan.": "Impossible d’enregistrer la campagne.",
    "Activer la campagne ini?": "Activer cette campagne ?",
    "Setelah aktif, komentar yang cocok dengan kata pemicu bisa langsung diproses.": "Une fois active, les commentaires correspondant au mot-clé pourront être traités immédiatement.",
    "Jeda hanya berlaku untuk campaign yang sudah tersimpan. Perubahan yang belum disimpan akan dibuang. Lanjutkan?": "La mise en pause ne s’applique qu’à une campagne déjà enregistrée. Les changements non enregistrés seront perdus. Continuer ?",
    "Mettre en pause ini? Auto-reply berhenti sampai campaign diaktifkan lagi.": "Mettre cette campagne en pause ? Les réponses automatiques seront interrompues jusqu’à sa réactivation.",
    "Campagnes gagal dijeda.": "Impossible de mettre la campagne en pause.",
    "Perubahan yang belum disimpan akan dibuang sebelum campaign dihapus. Lanjutkan?": "Les changements non enregistrés seront perdus avant la suppression de la campagne. Continuer ?",
    "Supprimer la campagne ini?": "Supprimer cette campagne ?",
    "Data delivery dan riwayat campaign ini ikut dihapus.": "Les livraisons et l’historique de cette campagne seront également supprimés.",
    "Ketik ID campaign untuk konfirmasi hapus:": "Saisissez l’identifiant de la campagne pour confirmer la suppression :",
    "Hapus dibatalkan. ID campaign tidak cocok.": "Suppression annulée : l’identifiant ne correspond pas.",
    "menghapus…": "suppression…",
    "Campagnes dihapus.": "Campagne supprimée.",
    "Campagnes gagal dihapus.": "Impossible de supprimer la campagne.",
    "Campagnes sedang aktif. Perubahan yang disimpan akan dipakai untuk komentar berikutnya.": "La campagne est active. Les changements enregistrés s’appliqueront aux prochains commentaires.",
    "Campagnes belum berjalan. Simpan sebagai draft, lalu aktifkan setelah dicek.": "La campagne n’est pas active. Enregistrez-la comme brouillon, puis activez-la après vérification.",
    "Choisir une publication yang akan dipantau dulu.": "Choisissez d’abord une publication à surveiller.",
    "Ada perubahan yang belum disimpan.": "Des modifications ne sont pas enregistrées.",
    "Ada perubahan yang belum disimpan. Lanjut ": "Des modifications ne sont pas enregistrées. Continuer ",
    'campaign.enabled ? "aktif" : "draft"': 'campaign.enabled ? "active" : "brouillon"',
    'campaign.commentReplyText || "tidak ada"': 'campaign.commentReplyText || "aucune"',
    "Draft: aman diedit sebelum diaktifkan.": "Brouillon : vous pouvez le modifier avant de l’activer.",
    "Rescue DM gagal: nyala": "Réponse de secours en cas d’échec du DM : activée",
    "Status: aktif": "Statut : active",
    "Status: draft": "Statut : brouillon",
    'isLive ? "aktif" : "draft"': 'isLive ? "active" : "brouillon"',
    "tombol tadi": "le bouton précédent",
    "Follow dulu akun ini, lalu tap ": "Abonne-toi d’abord à ce compte, puis appuie de nouveau sur ",
    " lagi. Kalau tombolnya gak muncul, réponds PRÊT.": ". Si le bouton n’apparaît pas, réponds PRÊT.",
    "Pesan langkah belum diisi.": "Message de l’étape non renseigné.",
    "Tombol langkah belum diisi.": "Bouton de l’étape non renseigné.",
    "Tombol belum diisi.": "Bouton non renseigné.",
    "Tekan tombol": "Appuyer sur le bouton",
    "Sebelum gue kirim promptnya, pilih dulu yang ini.": "Avant de t’envoyer la suite, choisis cette option.",
    "Pesan utama untuk langkah ini.": "Message principal de cette étape.",
    "Variasi pesan langkah": "Variantes du message de l’étape",
    "Variasi 1 untuk langkah ini\\nVariasi 2 untuk langkah ini": "Variante 1 pour cette étape\\nVariante 2 pour cette étape",
    "Langkah tambahan harus punya pesan dan tombol. Hapus langkah jika tidak dipakai.": "Chaque étape supplémentaire doit contenir un message et un bouton. Supprimez l’étape si elle n’est pas utilisée.",
    " langkah tambahan sebelum prompt/link akhir.": " étape(s) supplémentaire(s) avant le message ou le lien final.",
    "Memeriksa akses…": "Vérification de l’accès…",
    "Memuat data…": "Chargement des données…",
    "Field ini perlu dicek.": "Ce champ doit être vérifié.",
    "ID campaign sudah dipakai. Ganti nama/ID atau edit campaign yang sudah ada.": "Cet identifiant de campagne est déjà utilisé. Choisissez-en un autre ou modifiez la campagne existante.",
    "Data tidak ditemukan.": "Données introuvables.",
    "Request gagal (": "Échec de la requête (",
    "Tidak ada template cocok.": "Aucun modèle correspondant.",
    "Template ini sudah ada di campaign.": "Ce modèle est déjà présent dans la campagne.",
    "Belum ada variasi untuk disimpan.": "Aucune variante à enregistrer.",
    "Simpan ": "Enregistrer ",
    " template ke library?": " modèle(s) dans la bibliothèque ?",
    "Ini tidak menyimpan perubahan campaign.": "Cette action n’enregistre pas les modifications de la campagne.",
    "Library template tersimpan. Enregistrer la campagne jika ada perubahan.": "Bibliothèque de modèles enregistrée. Enregistrez la campagne si vous avez effectué des modifications.",
    "Ada balasan publik di library yang lebih dari 300 karakter. Cek baris yang terlalu panjang.": "Certaines réponses publiques de la bibliothèque dépassent 300 caractères. Vérifiez les lignes trop longues.",
    "Template gagal disimpan.": "Impossible d’enregistrer le modèle.",
    "Dashboard terkunci karena tidak aktif.": "Le tableau de bord a été verrouillé pour inactivité.",
    "mengunci dashboard": "verrouiller le tableau de bord",
}

changed = 0
missing = []
for old, new in replacements.items():
    if old in text:
        count = text.count(old)
        text = text.replace(old, new)
        changed += count
    else:
        missing.append(old)

path.write_text(text, encoding="utf-8")

# Recherche indicative uniquement dans l'interface : ne modifie pas les listes de mots-clés métier.
terms = re.compile(r"\b(belum|sudah|simpan|perubahan|pilih|dipilih|pakai|lihat|tombol|pesan|aktif|siap|buka|hapus|kembali|gagal|berhasil|wajib|hanya|setelah|sebelum|silakan|masuk|keluar|buat|kosong|pengguna|komentar|kirim|terima|lanjut|ubah|muat|dimuat|coba|sesi|akses|terakhir|tidak|ada|dulu|akun|kalau|langkah|balasan|template|campaign)\b", re.I)
remaining = []
for i, line in enumerate(text.splitlines(), 1):
    if terms.search(line):
        remaining.append((i, line.strip()))

print(f"{changed} remplacement(s) appliqué(s) dans {path}")
if text == original:
    print("Aucun changement : la traduction était peut-être déjà appliquée.")
if remaining:
    print("\nTextes potentiellement encore indonésiens à vérifier manuellement :")
    for line_no, line in remaining[:120]:
        print(f"  {line_no}: {line}")
    if len(remaining) > 120:
        print(f"  ... et {len(remaining) - 120} autre(s)")
else:
    print("Aucun terme indonésien courant détecté dans l’interface.")
