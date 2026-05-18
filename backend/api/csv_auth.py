import csv
import os
from pathlib import Path
from django.contrib.auth.hashers import check_password, make_password

# Ruta al archivo de usuarios
USERS_CSV = Path(__file__).resolve().parent.parent / 'users.csv'


def _load_users():
    """Lee todos los usuarios del CSV. Devuelve lista de dicts."""
    if not USERS_CSV.exists():
        return []
    with open(USERS_CSV, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        return list(reader)


def _save_users(users):
    """Guarda la lista de usuarios en el CSV."""
    with open(USERS_CSV, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['username', 'password'])
        writer.writeheader()
        writer.writerows(users)


def authenticate_csv(username, password):
    """
    Autentica un usuario contra el CSV.
    - Si la contraseña está en texto plano, la hashea y actualiza el CSV.
    - Devuelve True si las credenciales son correctas.
    """
    users = _load_users()
    updated = False

    for user in users:
        if user['username'].strip().lower() == username.strip().lower():
            stored_pw = user['password'].strip()

            # Detectar si la contraseña está hasheada (Django hashes empiezan con algoritmo)
            if stored_pw.startswith('pbkdf2_') or stored_pw.startswith('bcrypt') or stored_pw.startswith('argon2'):
                # Ya está hasheada → comparar con check_password
                if check_password(password, stored_pw):
                    return True
            else:
                # Está en texto plano → comparar directamente y luego hashear
                if stored_pw == password:
                    # Hashear y actualizar para la próxima vez
                    user['password'] = make_password(password)
                    updated = True
                    if updated:
                        _save_users(users)
                    return True

    return False


def user_exists(username):
    """Verifica si un usuario existe en el CSV."""
    users = _load_users()
    return any(u['username'].strip().lower() == username.strip().lower() for u in users)
