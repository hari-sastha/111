from flask import Flask, render_template_string, request, redirect, session, url_for
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'secret123'  # Change in real projects

# ---------------- DATABASE SETUP ----------------
def init_db():
    conn = sqlite3.connect('bank.db')
    c = conn.cursor()

    c.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        balance REAL DEFAULT 0
    )''')

    # Add sample users if not exists
    try:
        c.execute("INSERT INTO users (username, password, balance) VALUES (?, ?, ?)",
                  ('DILSHAND', generate_password_hash('1234'), 1000))
        c.execute("INSERT INTO users (username, password, balance) VALUES (?, ?, ?)",
                  ('NISHANTH', generate_password_hash('1234'), 500))
    except:
        pass

    conn.commit()
    conn.close()

# ---------------- LOGIN PAGE ----------------
@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        conn = sqlite3.connect('bank.db')
        c = conn.cursor()
        c.execute("SELECT * FROM users WHERE username=?", (username,))
        user = c.fetchone()
        conn.close()

        if user and check_password_hash(user[2], password):
            session['user'] = username
            return redirect('/dashboard')
        else:
            return "Invalid Login"

    return render_template_string('''
    <style>
        body{font-family:Arial;background:linear-gradient(135deg,#74ebd5,#ACB6E5);display:flex;justify-content:center;align-items:center;height:100vh;}
        .card{background:white;padding:30px;border-radius:15px;box-shadow:0 8px 20px rgba(0,0,0,0.2);width:320px;text-align:center;}
        input{width:90%;padding:10px;margin:10px 0;border:1px solid #ccc;border-radius:8px;}
        button{background:#4CAF50;color:white;padding:10px 20px;border:none;border-radius:8px;cursor:pointer;}
        button:hover{background:#45a049;}
    </style>
    <div class="card">
        <h2>🏦 Bank Login</h2>
        <form method="post">
            <input name="username" placeholder="Username"><br>
            <input type="password" name="password" placeholder="Password"><br>
            <button type="submit">Login</button>
        </form>
    </div>
    ''')

# ---------------- DASHBOARD ----------------
@app.route('/dashboard')
def dashboard():
    if 'user' not in session:
        return redirect('/')

    conn = sqlite3.connect('bank.db')
    c = conn.cursor()
    c.execute("SELECT balance FROM users WHERE username=?", (session['user'],))
    balance = c.fetchone()[0]
    conn.close()

    return render_template_string('''
    <style>
        body{font-family:Arial;background:#f4f6f9;padding:30px;}
        .container{max-width:600px;margin:auto;background:white;padding:30px;border-radius:15px;box-shadow:0 8px 20px rgba(0,0,0,0.15);}
        h2,h3{text-align:center;}
        form{margin:20px 0;}
        input{padding:10px;width:60%;border:1px solid #ccc;border-radius:8px;}
        button{padding:10px 15px;background:#007BFF;color:white;border:none;border-radius:8px;cursor:pointer;}
        button:hover{background:#0056b3;}
        a{display:block;text-align:center;margin-top:20px;color:red;text-decoration:none;font-weight:bold;}
    </style>
    <div class="container">
        <h2>Welcome {{user}}</h2>
        <h3>Balance: ₹{{balance}}</h3>

        <form action="/deposit" method="post">
            <label>Deposit:</label><br>
            <input name="amount" type="number" step="0.01">
            <button>Deposit</button>
        </form>

        <form action="/withdraw" method="post">
            <label>Withdraw:</label><br>
            <input name="amount" type="number" step="0.01">
            <button>Withdraw</button>
        </form>

        <form action="/transfer" method="post">
            <label>Transfer To:</label><br>
            <input name="to_user"><br><br>
            <label>Amount:</label><br>
            <input name="amount" type="number" step="0.01">
            <button>Transfer</button>
        </form>

        <a href="/logout">Logout</a>
    </div>
    ''', user=session['user'], balance=balance)

# ---------------- DEPOSIT ----------------
@app.route('/deposit', methods=['POST'])
def deposit():
    amount = float(request.form['amount'])

    conn = sqlite3.connect('bank.db')
    c = conn.cursor()
    c.execute("UPDATE users SET balance = balance + ? WHERE username=?",
              (amount, session['user']))
    conn.commit()
    conn.close()

    return redirect('/dashboard')

# ---------------- WITHDRAW ----------------
@app.route('/withdraw', methods=['POST'])
def withdraw():
    amount = float(request.form['amount'])

    conn = sqlite3.connect('bank.db')
    c = conn.cursor()
    c.execute("SELECT balance FROM users WHERE username=?", (session['user'],))
    balance = c.fetchone()[0]

    if balance >= amount:
        c.execute("UPDATE users SET balance = balance - ? WHERE username=?",
                  (amount, session['user']))
        conn.commit()

    conn.close()
    return redirect('/dashboard')

# ---------------- TRANSFER ----------------
@app.route('/transfer', methods=['POST'])
def transfer():
    to_user = request.form['to_user']
    amount = float(request.form['amount'])

    conn = sqlite3.connect('bank.db')
    c = conn.cursor()

    c.execute("SELECT balance FROM users WHERE username=?", (session['user'],))
    balance = c.fetchone()[0]

    c.execute("SELECT * FROM users WHERE username=?", (to_user,))
    receiver = c.fetchone()

    if balance >= amount and receiver:
        c.execute("UPDATE users SET balance = balance - ? WHERE username=?",
                  (amount, session['user']))
        c.execute("UPDATE users SET balance = balance + ? WHERE username=?",
                  (amount, to_user))
        conn.commit()

    conn.close()
    return redirect('/dashboard')

# ---------------- LOGOUT ----------------
@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')

# ---------------- RUN APP ----------------
if __name__ == '__main__':
    init_db()
    app.run(debug=True)
