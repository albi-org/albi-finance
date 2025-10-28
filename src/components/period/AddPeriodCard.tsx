import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useQueryClient } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { useMutation } from '@tanstack/react-query'
import { periodsService, type CreatePeriodData } from '@/services/firebase'

const AddPeriodCard: React.FC = () => {
  const { user, signOut } = useAuth()
  const queryClient = useQueryClient()

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

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500">
              Bem-vindo(a) de volta, {user?.email}!
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
                    Nenhum período de orçamento ativo encontrado para a data de
                    hoje.
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

export default AddPeriodCard
