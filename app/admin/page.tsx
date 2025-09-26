"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Download, Database, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Logo } from "@/components/logo"

interface Question {
  id: string
  question: string
  options: string[]
  correct_answer: number
  explanation: string
  difficulty: string
  tags: string[]
  domain: string
}

interface QuestionSet {
  certification: string
  description: string
  version: string
  questions: Question[]
}

export default function AdminPage() {
  const [jsonInput, setJsonInput] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{
    success: boolean
    message: string
    details?: any
  } | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setJsonInput(content)
      }
      reader.readAsText(file)
    }
  }

  const downloadSample = () => {
    const sampleData = {
      "certification": "AWS Certified Solutions Architect (CSA)",
      "description": "AWS CSA Sample Questions",
      "version": "1.0",
      "questions": [
        {
          "id": "csa-001",
          "question": "Which AWS service provides a fully managed NoSQL database service?",
          "options": [
            "Amazon RDS",
            "Amazon DynamoDB", 
            "Amazon Redshift",
            "Amazon ElastiCache"
          ],
          "correct_answer": 1,
          "explanation": "Amazon DynamoDB is a fully managed NoSQL database service that provides fast and predictable performance with seamless scalability.",
          "difficulty": "easy",
          "tags": ["database", "nosql", "managed-services"],
          "domain": "Database"
        }
      ]
    }
    
    const blob = new Blob([JSON.stringify(sampleData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sample-questions.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const validateJson = (jsonString: string): QuestionSet | null => {
    try {
      const data = JSON.parse(jsonString)
      
      // Validate structure
      if (!data.certification || !data.questions || !Array.isArray(data.questions)) {
        throw new Error("Invalid JSON structure. Missing required fields: certification, questions")
      }

      // Validate each question
      for (const question of data.questions) {
        if (!question.id || !question.question || !question.options || 
            !Array.isArray(question.options) || question.correct_answer === undefined) {
          throw new Error(`Invalid question structure for question: ${question.id || 'unknown'}`)
        }
      }

      return data
    } catch (error) {
      throw new Error(`JSON validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleUpload = async () => {
    if (!jsonInput.trim()) {
      toast.error("Por favor, insira ou carregue um arquivo JSON")
      return
    }

    setIsUploading(true)
    setUploadResult(null)

    try {
      // Validate JSON
      const questionSet = validateJson(jsonInput)
      
      // Upload to API
      const response = await fetch('/api/admin/questions/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionSet)
      })

      const result = await response.json()

      if (response.ok) {
        setUploadResult({
          success: true,
          message: `Sucesso! ${result.questionsAdded} questões adicionadas para ${result.certification}`,
          details: result
        })
        toast.success(`Upload realizado com sucesso! ${result.questionsAdded} questões adicionadas.`)
        setJsonInput("")
      } else {
        throw new Error(result.error || 'Erro no upload')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      setUploadResult({
        success: false,
        message: errorMessage
      })
      toast.error(`Erro no upload: ${errorMessage}`)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo className="h-10 w-auto" />
              <div>
                <h1 className="text-2xl font-bold">Admin Panel</h1>
                <p className="text-sm text-muted-foreground">Gerenciar questões e certificações</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload de Questões em Massa
              </CardTitle>
              <CardDescription>
                Faça upload de questões em formato JSON para adicionar múltiplas questões de uma vez.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="file-upload">Carregar arquivo JSON</Label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
              </div>

              {/* JSON Input */}
              <div className="space-y-2">
                <Label htmlFor="json-input">Ou cole o JSON diretamente</Label>
                <Textarea
                  id="json-input"
                  placeholder="Cole seu JSON aqui..."
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button onClick={downloadSample} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Exemplo
                </Button>
                <Button 
                  onClick={handleUpload} 
                  disabled={isUploading || !jsonInput.trim()}
                  className="flex-1"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Database className="mr-2 h-4 w-4" />
                      Enviar Questões
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Result */}
          {uploadResult && (
            <Alert className={uploadResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              {uploadResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={uploadResult.success ? "text-green-800" : "text-red-800"}>
                {uploadResult.message}
              </AlertDescription>
            </Alert>
          )}

          {/* JSON Structure Info */}
          <Card>
            <CardHeader>
              <CardTitle>Estrutura JSON Requerida</CardTitle>
              <CardDescription>
                Formato necessário para upload de questões
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
{`{
  "certification": "Nome da Certificação",
  "description": "Descrição da certificação",
  "version": "1.0",
  "questions": [
    {
      "id": "unique-id",
      "question": "Texto da pergunta",
      "options": ["Opção 1", "Opção 2", "Opção 3", "Opção 4"],
      "correct_answer": 0,
      "explanation": "Explicação da resposta",
      "difficulty": "easy|medium|hard",
      "tags": ["tag1", "tag2"],
      "domain": "Domínio da questão"
    }
  ]
}`}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
