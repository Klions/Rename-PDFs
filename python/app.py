import tkinter as tk
from tkinter import filedialog, messagebox
import PyPDF2
import os
import shutil

# Variável global para armazenar o diretório da pasta renomeados
pasta_renomeados = "renomeados"

# Função para selecionar vários arquivos PDF
def selecionar_pdfs():
    caminhos_pdfs = filedialog.askopenfilenames(
        title="Selecione os arquivos PDF",
        filetypes=[("Arquivos PDF", "*.pdf")]
    )
    if caminhos_pdfs:
        caminhos_label.config(text=f"{len(caminhos_pdfs)} arquivos PDF selecionados")

# Função para selecionar o diretório da pasta renomeados
def selecionar_diretorio():
    global pasta_renomeados
    pasta_selecionada = filedialog.askdirectory(title="Selecione o diretório para salvar os arquivos renomeados")
    if pasta_selecionada:
        pasta_renomeados = pasta_selecionada
        diretorio_label.config(text="Diretório: " + pasta_renomeados)

# Função para extrair os RAs dos PDFs selecionados e renomear os arquivos
def extrair_ras():
    global pasta_renomeados
    caminhos_pdfs = caminhos_label.cget("text")

    if not caminhos_pdfs or caminhos_pdfs.startswith("0 arquivos"):
        messagebox.showwarning("Aviso", "Por favor, selecione ao menos um arquivo PDF.")
        return

    if not pasta_renomeados:
        messagebox.showwarning("Aviso", "Por favor, selecione o diretório para salvar os arquivos renomeados.")
        return

    r_as = []

    # Define a pasta onde os arquivos serão salvos
    if criar_pasta_automaticamente.get():
        pasta_destino = os.path.join(pasta_renomeados, "renomeados")
    else:
        pasta_destino = pasta_renomeados

    # Cria a pasta de destino se não existir
    if not os.path.exists(pasta_destino):
        os.makedirs(pasta_destino)

    try:
        for caminho_pdf in caminhos_pdfs.splitlines():
            with open(caminho_pdf, "rb") as arquivo:
                leitor = PyPDF2.PdfReader(arquivo)

                # Itera sobre todas as páginas do PDF
                ra_encontrado = False
                for pagina in leitor.pages:
                    texto = pagina.extract_text()

                    # Procura por informações após "RA:" no texto extraído
                    linhas = texto.splitlines()
                    for linha in linhas:
                        if "RA:" in linha:
                            try:
                                ra = linha.split("RA:")[1].strip()  # Extrai o texto após "RA:"
                                r_as.append(ra)

                                # Copia o arquivo para a pasta renomeados com o novo nome
                                novo_nome = os.path.join(pasta_destino, f"{ra}.pdf")
                                shutil.copy(caminho_pdf, novo_nome)
                                ra_encontrado = True
                                break
                            except IndexError:
                                continue
                    if ra_encontrado:
                        break

        # Exibe os RAs extraídos na área de texto
        texto_saida.delete("1.0", tk.END)
        if r_as:
            texto_saida.insert(tk.END, "\n".join(r_as))
            concluido_label.config(text="Processo concluído com sucesso!")
        else:
            texto_saida.insert(tk.END, "Nenhum RA encontrado nos PDFs.")

    except Exception as e:
        messagebox.showerror("Erro", f"Ocorreu um erro ao processar os arquivos PDF:\n{e}")

# Criação da janela principal
janela = tk.Tk()
janela.title("Extrator de RAs de PDFs")
janela.geometry("600x500")

# Variável global para o estado do checkbox
criar_pasta_automaticamente = tk.BooleanVar(value=True)

# Layout da interface
tk.Label(janela, text="Selecione os arquivos PDF:").pack(pady=5)

# Label para exibir os caminhos dos arquivos PDF selecionados
caminhos_label = tk.Label(janela, text="Nenhum arquivo selecionado", bg="white", width=70, height=3, anchor="nw", justify="left", relief="sunken")
caminhos_label.pack(pady=5)

# Botão para selecionar os PDFs
tk.Button(janela, text="Procurar", command=selecionar_pdfs).pack(pady=5)

# Entrada e botão para o diretório da pasta renomeados
tk.Label(janela, text="Selecione o diretório para salvar os arquivos renomeados:").pack(pady=5)

diretorio_label = tk.Label(janela, text="Diretório: " + pasta_renomeados, bg="white", width=70, height=1, anchor="w", relief="sunken")
diretorio_label.pack(pady=5)

# Botão para selecionar o diretório
tk.Button(janela, text="Selecionar Diretório", command=selecionar_diretorio).pack(pady=5)

# Checkbox para criar pasta automaticamente
tk.Checkbutton(janela, text="Criar pasta automaticamente", variable=criar_pasta_automaticamente).pack(pady=5)

# Botão para extrair os RAs
tk.Button(janela, text="Extrair RAs", command=extrair_ras).pack(pady=10)

# Área de texto para exibir os resultados
texto_saida = tk.Text(janela, width=60, height=5)  # Reduzido para ocupar menos espaço
texto_saida.pack(pady=5)

# Label para exibir mensagem de conclusão
concluido_label = tk.Label(janela, text="", fg="green")
concluido_label.pack(pady=5)

# Executa a interface
janela.mainloop()
