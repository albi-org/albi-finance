import { useAuth } from '@/hooks/useAuth'
import { Navigate } from 'react-router-dom'
import React from 'react'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/supabase/supabase'

async function fetchPeriods() {
  // --- DEBUGGING ---
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (session) {
    console.log('✅ ID do usuário LOGADO no App:', session.user.id)
  } else {
    console.error('❌ Nenhum usuário logado no momento da consulta!')
    return null
  }
  // --- FIM DO DEBUGGING ---

  const { data } = await supabase
    .from('periods')
    .select('id, name, budget_goal')

  return data
}

const Dashboard: React.FC = () => {
  const { user, signOut, loading: authLoading } = useAuth()

  const { data: periods, isLoading: queryLoading } = useQuery({
    queryKey: ['periods'], // Uma chave única para essa busca.
    queryFn: fetchPeriods, // A função que executa a busca.
  })

  if (queryLoading) {
    return <>Consulta ainda está sendo feita!</>
  }

  if (!authLoading && !user) {
    return <Navigate to="/" replace />
  }

  return (
    <>
      Olá você está no dashboard.
      <Button variant={'outline'} onClick={signOut}>
        Deslogar
      </Button>
      <div>
        <h2 className="text-xl font-bold mb-4">Meus Períodos</h2>
        <ul>
          {periods?.map((period) => (
            <li key={period.id} className="border-b p-2">
              <p className="font-semibold">{period.name}</p>
              <p className="text-sm text-gray-500">
                Meta do Orçamento: R$ {period.budget_goal}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default Dashboard
