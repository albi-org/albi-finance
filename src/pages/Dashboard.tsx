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
import { fetchDashboardData, type Transaction } from '@/services/firebase'
import NoPeriodCard from '@/components/period/NoPeriodCard'

const Dashboard: React.FC = () => {
  const { user, signOut, loading: authLoading } = useAuth()
  const queryClient = useQueryClient()
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboardData', user?.uid],
    queryFn: () => fetchDashboardData(user!.uid),
    enabled: !!user,
  })

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
    return <NoPeriodCard />
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

  const totalExpenses = transactions.reduce((sum, tx) => sum + tx.amount, 0)

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
              <span className="text-4xl font-bold tracking-tight">
                <span
                  className={
                    totalExpenses > currentPeriod.budget_goal
                      ? ' text-red-600'
                      : ''
                  }
                >
                  {numberFormat.format(totalExpenses)}
                </span>
                {' / '}
                <span className="text-4xl font-bold tracking-tight text-green-600">
                  {numberFormat.format(currentPeriod.budget_goal)}
                </span>
              </span>
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
