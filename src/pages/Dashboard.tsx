import { useAuth } from '@/hooks/useAuth'
import { Navigate } from 'react-router-dom'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { PlusCircle } from 'lucide-react'
import AddTransactionForm from '@/components/AddTransactionForm'
import {
  fetchDashboardData,
  type Transaction,
  periodsService,
  type CreatePeriodData,
} from '@/services/firebase'
import { useMutation } from '@tanstack/react-query'

const Dashboard: React.FC = () => {
  const { user, signOut, loading: authLoading } = useAuth()
  const queryClient = useQueryClient()
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboardData', user?.uid],
    queryFn: () => fetchDashboardData(user!.uid),
    enabled: !!user,
  })

  const createPeriodMutation = useMutation({
    mutationFn: async (newPeriod: CreatePeriodData) => {
      return await periodsService.createPeriod(newPeriod)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] })
    },
    onError: (error) => {
      console.error('Erro ao criar período:', error)
      alert('Não foi possível criar o período.')
    },
  })

  const handleCreatePeriod = () => {
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    const monthNames = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ]

    const periodName = `${monthNames[today.getMonth()]} ${today.getFullYear()}`

    createPeriodMutation.mutate({
      user_id: user!.uid,
      name: periodName,
      start_date: firstDay.toISOString().split('T')[0],
      end_date: lastDay.toISOString().split('T')[0],
      budget_goal: 1000, // Valor padrão, pode ser alterado depois
    })
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Carregando informações...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Ocorreu um erro ao carregar os dados do dashboard.
      </div>
    )
  }

  if (!data?.currentPeriod) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-500">
                Bem-vindo(a) de volta, {user.email}!
              </p>
            </div>
            <Button variant={'outline'} onClick={signOut}>
              Sair
            </Button>
          </header>

          <div className="flex h-96 items-center justify-center">
            <Card className="w-full max-w-md">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <PlusCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Nenhum período de orçamento ativo encontrado para a data
                      de hoje.
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Por favor, crie um novo período para começar a controlar
                      suas finanças.
                    </p>
                    <Button
                      onClick={handleCreatePeriod}
                      disabled={createPeriodMutation.isPending}
                      className="w-full"
                    >
                      {createPeriodMutation.isPending ? (
                        'Criando período...'
                      ) : (
                        <>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Criar Período do Mês Atual
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const { currentPeriod, transactions } = data

  const handleTransactionSuccess = () => {
    setIsAddTransactionOpen(false)
    queryClient.invalidateQueries({ queryKey: ['dashboardData'] })
  }

  const numberFormat = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500">
              Bem-vindo(a) de volta, {user.email}!
            </p>
          </div>
          <Button variant={'outline'} onClick={signOut}>
            Sair
          </Button>
        </header>

        <main className="flex flex-col gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Orçamento para: {currentPeriod.name}</CardTitle>
              <CardDescription>
                Sua meta de gastos para o período de{' '}
                {new Date(currentPeriod.start_date).toLocaleDateString('pt-BR')}{' '}
                a {new Date(currentPeriod.end_date).toLocaleDateString('pt-BR')}
                .
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold tracking-tight text-green-600">
                {numberFormat.format(currentPeriod.budget_goal)}
              </p>
            </CardContent>
          </Card>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Transações Recentes
              </h2>
              <Dialog
                open={isAddTransactionOpen}
                onOpenChange={setIsAddTransactionOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Transação
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Adicionar Nova Transação</DialogTitle>
                    <DialogDescription>
                      Preencha os detalhes da sua nova despesa.
                    </DialogDescription>
                  </DialogHeader>
                  <AddTransactionForm
                    periodId={currentPeriod.id}
                    userId={user.uid}
                    onSuccess={handleTransactionSuccess}
                  />
                </DialogContent>
              </Dialog>
            </div>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length > 0 ? (
                    transactions.map((tx: Transaction) => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-medium">
                          {tx.description || '-'}
                        </TableCell>
                        <TableCell className="capitalize">
                          {tx.category}
                        </TableCell>
                        <TableCell>
                          {tx.transaction_date
                            .toDate()
                            .toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell className="text-right font-mono text-red-500">
                          -{' '}
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(tx.amount)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-gray-500 py-8"
                      >
                        Nenhuma transação encontrada para este período.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
