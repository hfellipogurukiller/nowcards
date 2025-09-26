# Como Usar o Agente CSA ServiceNow

## 🚀 Prompt Base para ChatGPT

Copie e cole este prompt no ChatGPT:

```
Você é um especialista em ServiceNow CSA (Certified System Administrator). Crie questões JSON para o sistema NowCards seguindo EXATAMENTE este formato:

```json
{
  "certification": "ServiceNow Certified System Administrator (CSA)",
  "description": "ServiceNow CSA Practice Questions", 
  "version": "1.0",
  "questions": [
    {
      "id": "csa-sn-001",
      "question": "Sua pergunta aqui?",
      "options": [
        "Opção A",
        "Opção B", 
        "Opção C",
        "Opção D"
      ],
      "correct_answer": 0,
      "explanation": "Explicação detalhada da resposta correta.",
      "difficulty": "easy|medium|hard",
      "tags": ["tag1", "tag2", "tag3"],
      "domain": "Nome do Domínio"
    }
  ]
}
```

DOMÍNIOS CSA: Core Platform, Data Management, User Administration, Business Rules, Forms & UI, Service Catalog, Incident Management, Change Management, Knowledge Management, Reporting.

DIFICULDADES: easy (conceitos básicos), medium (aplicação prática), hard (configuração avançada).

TAGS: Use 3-5 palavras-chave relevantes (ex: ["users", "acls", "security"]).

SEMPRE retorne apenas JSON válido, sem texto adicional. Use IDs únicos (csa-sn-XXX).

Crie questões práticas que testem conhecimentos reais de administração ServiceNow.
```

## 📝 Exemplos de Solicitações

### **1. Questões Básicas de Usuários**
```
Crie 3 questões easy sobre User Administration, focando em:
- Criação de usuários
- Grupos e papéis
- Configurações básicas
```

### **2. Questões de Business Rules**
```
Crie 5 questões medium sobre Business Rules, incluindo:
- Diferença entre before/after
- Scripts server-side
- Validações de dados
- Integrações
```

### **3. Questões de Segurança**
```
Crie 4 questões hard sobre ACLs e segurança:
- Configuração de ACLs
- Herança de permissões
- Segurança de dados
- Auditoria
```

### **4. Questões de Workflow**
```
Crie 6 questões medium sobre Workflows:
- Criação de workflows
- Aprovações
- Notificações
- Condições
```

## 🎯 Dicas para Melhores Resultados

### **Seja Específico:**
- ✅ "Crie 5 questões sobre ACLs"
- ❌ "Crie algumas questões"

### **Mencione o Nível:**
- ✅ "3 questões easy sobre usuários"
- ❌ "Questões sobre usuários"

### **Foque em Domínios:**
- ✅ "Questões de Incident Management"
- ❌ "Questões gerais"

### **Peça Variação:**
- ✅ "Mix de easy, medium e hard"
- ❌ "Só questões fáceis"

## 📊 Estrutura de Resposta Esperada

O ChatGPT deve retornar algo como:

```json
{
  "certification": "ServiceNow Certified System Administrator (CSA)",
  "description": "ServiceNow CSA Practice Questions",
  "version": "1.0", 
  "questions": [
    {
      "id": "csa-sn-001",
      "question": "Qual é a tabela base para gerenciar usuários no ServiceNow?",
      "options": [
        "sys_user",
        "user_table",
        "person", 
        "employee"
      ],
      "correct_answer": 0,
      "explanation": "A tabela sys_user é a tabela base para gerenciar usuários no ServiceNow. Ela contém informações como nome, email, departamento e status do usuário.",
      "difficulty": "easy",
      "tags": ["users", "tables", "administration"],
      "domain": "User Administration"
    }
  ]
}
```

## ⚠️ Validação Importante

Antes de usar no NowCards, verifique:

1. **JSON válido** - Use um validador JSON
2. **IDs únicos** - csa-sn-001, csa-sn-002, etc.
3. **Campos obrigatórios** - Todos os campos presentes
4. **Opções corretas** - 4 opções, 1 correta
5. **Explicação clara** - Detalhada e educativa

## 🚀 Próximos Passos

1. **Copie o prompt** para o ChatGPT
2. **Faça sua solicitação** específica
3. **Valide o JSON** retornado
4. **Salve em arquivo** .json
5. **Use no admin** do NowCards
6. **Teste as questões** no sistema
