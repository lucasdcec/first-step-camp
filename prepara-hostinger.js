const fs = require('fs');
const path = require('path');

const sourceStandalone = path.join(__dirname, '.next', 'standalone');
const targetDeploy = path.join(__dirname, 'PRONTO_PRA_HOSTINGER');

if (!fs.existsSync(sourceStandalone)) {
  console.error("Erro: A pasta .next/standalone não foi encontrada. Rode 'npm run build' primeiro.");
  process.exit(1);
}

// Criar pasta de deploy
if (fs.existsSync(targetDeploy)) {
  fs.rmSync(targetDeploy, { recursive: true, force: true });
}
fs.mkdirSync(targetDeploy);

// Função para copiar diretórios recursivamente
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Copiar o standalone inteiro para "PRONTO_PRA_HOSTINGER"
console.log('1. Copiando arquivos do servidor (standalone)...');
copyDir(sourceStandalone, targetDeploy);

// 2. Copiar as pastas estáticas vitais que o standalone não copia por padrão
console.log('2. Copiando pasta public...');
copyDir(path.join(__dirname, 'public'), path.join(targetDeploy, 'public'));

console.log('3. Copiando estilos e estáticos do Next...');
copyDir(path.join(__dirname, '.next', 'static'), path.join(targetDeploy, '.next', 'static'));

// 3. Copiar variáveis de ambiente para a produção
console.log('4. Copiando .env.local...');
if (fs.existsSync(path.join(__dirname, '.env.local'))) {
  fs.copyFileSync(path.join(__dirname, '.env.local'), path.join(targetDeploy, '.env.local'));
}

console.log('--------------------------------------------------');
console.log('✅ SUCESSO! Tudo pronto para a Hostinger.');
console.log('Todos os arquivos necessários estão na pasta "PRONTO_PRA_HOSTINGER".');
console.log('➡️  PASSO A PASSO PARA A HOSTINGER:');
console.log('   1. Faça o upload de TODOS os arquivos que estão DENTRO da pasta "PRONTO_PRA_HOSTINGER" para sua pasta "public_html/first-stape".');
console.log('   2. No painel de Node.js da Hostinger, coloque "server.js" como Arquivo de Inicialização (Startup File).');
console.log('   3. Inicie o servidor. Pronto!');
console.log('--------------------------------------------------');
