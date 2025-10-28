import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import AddPeriodDialog from '@/components/period/AddPeriodDialog'

const NoPeriodCard: React.FC = () => {
  const { user, signOut } = useAuth()

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
                  <AddPeriodDialog />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default NoPeriodCard
