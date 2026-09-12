import re, subprocess, pathlib, sys

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
DEST = pathlib.Path("src/fontes")

FAMILIAS = {
    "Inter": "Inter:wght@400;500;600;700",
    "Sora": "Sora:wght@500;600;700;800",
    "Fraunces": "Fraunces:opsz,wght@9..144,500;9..144,700",
    "Archivo": "Archivo:wght@600;700;800",
    "Instrument+Sans": "Instrument+Sans:wght@500;600;700",
}

def buscar(url):
    r = subprocess.run(["curl", "-sS", "-A", UA, url], capture_output=True)
    if r.returncode != 0:
        sys.exit("falhou: " + url + " " + r.stderr.decode()[:200])
    return r.stdout.decode()

regras = []
for nome, spec in FAMILIAS.items():
    css = buscar(f"https://fonts.googleapis.com/css2?family={spec}&display=swap")
    # só o bloco /* latin */ — Português cabe todo nele
    blocos = re.split(r"/\*\s*([\w-]+)\s*\*/", css)
    for i in range(1, len(blocos), 2):
        subset, corpo = blocos[i], blocos[i + 1]
        if subset != "latin":
            continue
        url = re.search(r"url\((https://[^)]+\.woff2)\)", corpo).group(1)
        peso = re.search(r"font-weight:\s*([^;]+);", corpo).group(1).strip()
        estilo = re.search(r"font-style:\s*([^;]+);", corpo).group(1).strip()
        familia = re.search(r"font-family:\s*'([^']+)'", corpo).group(1)
        arq = f"{familia.replace(' ', '-').lower()}-{peso.replace(' ', '-')}.woff2"
        subprocess.run(["curl", "-sS", "-A", UA, "-o", str(DEST / arq), url], check=True)
        regras.append((familia, peso, estilo, arq))
        print(f"{arq:36} {(DEST/arq).stat().st_size//1024:4} KB")

linhas = [
    "/* Fontes hospedadas aqui, não na Google.",
    " *",
    " * Três razões: a demo em um arquivo só precisa abrir sem internet, uma",
    " * requisição a menos é meio segundo a menos no 3G do interior, e nenhum",
    " * IP de cliente vai pra fora. Subconjunto latino — cobre o português.",
    " *",
    " * Gerado por scripts/fontes.py. Não edite à mão.",
    " */",
    "",
]
for familia, peso, estilo, arq in regras:
    linhas += [
        "@font-face {",
        f'  font-family: "{familia}";',
        f"  font-style: {estilo};",
        f"  font-weight: {peso};",
        "  font-display: swap;",
        f'  src: url("./fontes/{arq}") format("woff2");',
        "}",
        "",
    ]
pathlib.Path("src/fontes.css").write_text("\n".join(linhas))
print("regras:", len(regras))
