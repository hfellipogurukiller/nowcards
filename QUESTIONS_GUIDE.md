# 📚 Guia para Criação de Questões - NowCards

Este guia explica como criar e formatar questões para upload no sistema NowCards.

## 📋 Estrutura Básica do JSON

```json
{
  "certification": "Nome da Certificação",
  "description": "Descrição opcional",
  "version": "1.0",
  "questions": [
    // Array de questões aqui
  ]
}
```

## 🎯 Tipos de Questões Suportadas

### 1. Questões de Resposta Única
Use `correct_answer` com um número (índice da opção correta).

```json
{
  "id": "questao-001",
  "question": "Qual é a capital do Brasil?",
  "options": [
    "São Paulo",
    "Rio de Janeiro", 
    "Brasília",
    "Belo Horizonte"
  ],
  "correct_answer": 2,
  "explanation": "Brasília é a capital federal do Brasil desde 1960.",
  "difficulty": "easy",
  "tags": ["geografia", "brasil", "capitais"],
  "domain": "Geografia"
}
```

### 2. Questões de Múltipla Escolha
Use `correct_answers` com um array de números (índices das opções corretas).

```json
{
  "id": "questao-002",
  "question": "Quais são os benefícios do AWS Auto Scaling? (Selecione todas que se aplicam)",
  "options": [
    "Escalabilidade automática",
    "Otimização de custos",
    "Alta disponibilidade",
    "Intervenção manual obrigatória"
  ],
  "correct_answers": [0, 1, 2],
  "explanation": "O AWS Auto Scaling oferece escalabilidade automática, otimização de custos e alta disponibilidade. A intervenção manual não é um benefício.",
  "difficulty": "medium",
  "tags": ["aws", "auto-scaling", "cloud"],
  "domain": "Computação"
}
```

## 📝 Campos Obrigatórios

### Para Cada Questão:
- **`id`**: Identificador único da questão (string)
- **`question`**: Texto da pergunta (string)
- **`options`**: Array com as opções de resposta (array de strings)
- **`correct_answer`** OU **`correct_answers`**: Resposta(s) correta(s)
- **`explanation`**: Explicação da resposta (string)
- **`difficulty`**: Nível de dificuldade (string)
- **`tags`**: Tags para categorização (array de strings)
- **`domain`**: Domínio/categoria da questão (string)

### Para o Conjunto:
- **`certification`**: Nome da certificação (string)
- **`questions`**: Array com todas as questões (array)

## 🎨 Campos Opcionais

- **`description`**: Descrição do conjunto de questões
- **`version`**: Versão do conjunto (padrão: "1.0")

## 📊 Níveis de Dificuldade

Use um destes valores para `difficulty`:
- `"easy"` - Fácil
- `"medium"` - Médio  
- `"hard"` - Difícil

## 🏷️ Sistema de Tags

Use tags descritivas para facilitar a busca e categorização:

```json
"tags": ["aws", "s3", "storage", "cloud", "managed-services"]
```

## 🎯 Domínios Sugeridos

- **Computação**: "Compute", "Serverless", "Containers"
- **Armazenamento**: "Storage", "Database", "Backup"
- **Rede**: "Networking", "Security", "CDN"
- **Segurança**: "Security", "IAM", "Encryption"
- **Monitoramento**: "Monitoring", "Logging", "Analytics"

## ✅ Exemplo Completo

```json
{
  "certification": "AWS Certified Solutions Architect",
  "description": "Questões de prática para AWS CSA",
  "version": "1.0",
  "questions": [
    {
      "id": "aws-001",
      "question": "Qual serviço AWS é melhor para armazenar arquivos estáticos de um website?",
      "options": [
        "Amazon S3",
        "Amazon EBS",
        "Amazon EFS",
        "Amazon Glacier"
      ],
      "correct_answer": 0,
      "explanation": "Amazon S3 é ideal para armazenar arquivos estáticos como imagens, CSS e JavaScript de websites.",
      "difficulty": "easy",
      "tags": ["aws", "s3", "storage", "website", "static-files"],
      "domain": "Storage"
    },
    {
      "id": "aws-002", 
      "question": "Quais são características do Amazon RDS? (Selecione todas que se aplicam)",
      "options": [
        "Serviço gerenciado",
        "Backups automáticos",
        "Escalabilidade manual apenas",
        "Deploy Multi-AZ"
      ],
      "correct_answers": [0, 1, 3],
      "explanation": "Amazon RDS é um serviço gerenciado com backups automáticos e suporte a Multi-AZ. Oferece escalabilidade automática, não apenas manual.",
      "difficulty": "medium",
      "tags": ["aws", "rds", "database", "managed-service", "multi-az"],
      "domain": "Database"
    }
  ]
}
```

## 🚨 Regras Importantes

### ✅ Faça:
- Use IDs únicos para cada questão
- Mantenha as opções claras e concisas
- Inclua explicações detalhadas
- Use tags relevantes e consistentes
- Teste o JSON antes do upload

### ❌ Evite:
- IDs duplicados
- Opções muito longas
- Explicações vagas
- Tags irrelevantes
- JSON malformado

## 🔍 Validação

Antes do upload, verifique:
1. **JSON válido**: Use um validador JSON online
2. **IDs únicos**: Cada questão deve ter um ID diferente
3. **Opções suficientes**: Mínimo de 2 opções por questão
4. **Respostas válidas**: Índices devem existir nas opções
5. **Campos obrigatórios**: Todos os campos necessários preenchidos

## 📤 Como Fazer Upload

1. Acesse `/admin` no sistema
2. Cole o JSON no campo de texto OU
3. Faça upload de um arquivo `.json`
4. Clique em "Enviar Questões"
5. Aguarde a confirmação de sucesso

## 🎯 Dicas para Criar Boas Questões

### Questões de Resposta Única:
- Faça perguntas claras e diretas
- Use 4 opções quando possível
- Evite opções óbvias como "Todas as anteriores"
- Inclua apenas uma resposta correta

### Questões de Múltipla Escolha:
- Indique claramente "Selecione todas que se aplicam"
- Use 2-4 respostas corretas
- Evite opções contraditórias
- Mantenha o mesmo nível de detalhe nas opções

### Explicações:
- Explique **por que** a resposta está correta
- Mencione conceitos relacionados
- Inclua exemplos práticos quando relevante
- Mantenha um tom educativo

## 🔧 Solução de Problemas

### Erro: "JSON inválido"
- Verifique a sintaxe do JSON
- Use aspas duplas, não simples
- Verifique vírgulas e chaves

### Erro: "Questão inválida"
- Verifique se todos os campos obrigatórios estão preenchidos
- Confirme se `correct_answer` ou `correct_answers` está presente
- Verifique se os índices das respostas são válidos

### Erro: "ID duplicado"
- Use IDs únicos para cada questão
- Evite reutilizar IDs de questões existentes

---

**💡 Dica**: Comece com poucas questões para testar o formato, depois expanda o conjunto gradualmente.
