import smtplib
from email.mime.text import MIMEText
import os

def send_otp_email(to_email: str, code: str):
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    sender_email = os.getenv("GMAIL_SENDER")
    sender_password = os.getenv("GMAIL_PASSWORD")

    subject = "Votre code de connexion"
    body = f"Bonjour, votre code de vérification est : {code}"

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = sender_email
    msg["To"] = to_email

    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(msg)
        print(f"\u2705 Code envoyé à {to_email}")

