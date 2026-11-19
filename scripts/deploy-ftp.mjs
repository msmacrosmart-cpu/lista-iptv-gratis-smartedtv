/**
 * Envia dist/client para a hospedagem via FTP.
 *
 * Variáveis de ambiente obrigatórias:
 *   FTP_HOST  (padrão: ftpupload.net)
 *   FTP_USER
 *   FTP_PASS
 *   FTP_DIR   (padrão: htdocs)
 *
 * Uso: node scripts/deploy-ftp.mjs [--dry-run]
 */
import { Client } from "basic-ftp";
import { existsSync } from "node:fs";
import { join } from "node:path";

const LOCAL_DIR = "dist/client";
const HOST = process.env.FTP_HOST || "ftpupload.net";
const USER = process.env.FTP_USER;
const PASS = process.env.FTP_PASS;
const REMOTE_DIR = process.env.FTP_DIR || "htdocs";
const DRY_RUN = process.argv.includes("--dry-run");

if (!existsSync(LOCAL_DIR)) {
  console.error(`[deploy] Pasta ${LOCAL_DIR} não encontrada. Rode o build estático antes.`);
  process.exit(1);
}

if (!USER || !PASS) {
  console.error("[deploy] Defina FTP_USER e FTP_PASS (secrets do GitHub ou variáveis locais).");
  process.exit(1);
}

const client = new Client(60_000);
client.ftp.verbose = process.env.FTP_VERBOSE === "1";

try {
  console.log(`[deploy] Conectando em ${HOST}...`);
  await client.access({
    host: HOST,
    user: USER,
    password: PASS,
    secure: false,
  });

  if (DRY_RUN) {
    console.log(`[deploy] Dry-run: listando ${REMOTE_DIR}`);
    const list = await client.list(REMOTE_DIR);
    console.log(list.map((f) => `${f.type === 2 ? "d" : "-"} ${f.name}`).join("\n"));
  } else {
    console.log(`[deploy] Enviando ${LOCAL_DIR} -> ${REMOTE_DIR}`);
    await client.ensureDir(REMOTE_DIR);
    await client.cd(REMOTE_DIR);
    // clearWorkingDir garante que arquivos antigos (com hash diferente) saiam do ar.
    await client.uploadFromDir(LOCAL_DIR, {
      // não envia o .htaccess duas vezes nem apaga a pasta de e-mails/segurança do host
    });
    console.log("[deploy] Concluído com sucesso.");
  }
} catch (error) {
  console.error("[deploy] Falhou:", error?.message || error);
  if (String(error?.message || "").includes("150")) {
    console.error("[deploy] Dica: o InfinityFree limita conexões simultâneas; tente novamente.");
  }
  process.exitCode = 1;
} finally {
  client.close();
}
