import { useAuth } from '@/hooks/useAuth'
import { Navigate } from 'react-router-dom'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/supabase/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PlusCircle } from 'lucide-react'
import type { Database } from '@/types/supabase' // Importando os tipos gerados

// Tipos para facilitar
type Transaction = Database['public']['Tables']['transactions']['Row'];
type Period = Database['public']['Tables']['periods']['Row'];
type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
type TransactionCategory = Database['public']['Enums']['transaction_category'];

// 1. Função de busca de dados mais inteligente
async function fetchDashboardData(): Promise<{ currentPeriod: Period | null; transactions: Transaction[] }> {
  const today = new Date().toISOString().split('T')[0]

  const { data: currentPeriod, error: periodError } = await supabase
    .from('periods')
    .select('*')
    .lte('start_date', today)
    .gte('end_date', today)
    .single()

  if (periodError && periodError.code !== 'PGRST116') {
    console.error('Erro ao buscar período:', periodError)
    throw new Error(periodError.message)
  }

  if (!currentPeriod) {
    return { currentPeriod: null, transactions: [] }
  }

  const { data: transactions, error: transactionsError } = await supabase
    .from('transactions')
    .select('*')
    .eq('period_id', currentPeriod.id)
    .order('transaction_date', { ascending: false })

  if (transactionsError) {
    console.error('Erro ao buscar transações:', transactionsError)
    throw new Error(transactionsError.message)
  }

  return { currentPeriod, transactions: transactions || [] }
}

// 3. Componente do Formulário para Adicionar Transação
// Manter o formulário como um componente separado organiza melhor o código.
interface AddTransactionFormProps {
  periodId: number;
  userId: string;
  onSuccess: () => void;
}

function AddTransactionForm({ periodId, userId, onSuccess }: AddTransactionFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<TransactionCategory | ''>('');

  const addTransactionMutation = useMutation({
    mutationFn: async (newTransaction: TransactionInsert) => {
      const { error } = await supabase.from('transactions').insert(newTransaction);
      if (error) throw error;
    },
    onSuccess: () => {
      console.log('Transação adicionada com sucesso!');
      onSuccess(); // Chama a função do pai para fechar o modal e revalidar os dados
    },
    onError: (error) => {
      console.error('Erro ao adicionar transação:', error);
      alert('Não foi possível adicionar a transação.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    addTransactionMutation.mutate({
      description,
      amount: parseFloat(amount),
      category,
      period_id: periodId,
      user_id: userId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">Descrição</Label>
        <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="amount" className="text-right">Valor</Label>
        <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="category" className="text-right">Categoria</Label>
        <Select onValueChange={(value) => setCategory(value as TransactionCategory)} value={category}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="groceries">Mercado</SelectItem>
            <SelectItem value="transport">Transporte</SelectItem>
            <SelectItem value="entertainment">Entretenimento</SelectItem>
            <SelectItem value="utilities">Contas</SelectItem>
            <SelectItem value="health">Saúde</SelectItem>
            <SelectItem value="education">Educação</SelectItem>
            <SelectItem value="other">Outros</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">Cancelar</Button>
        </DialogClose>
        <Button type="submit" disabled={addTransactionMutation.isPending}>
          {addTransactionMutation.isPending ? 'Salvando...' : 'Salvar Transação'}
        </Button>
      </DialogFooter>
    </form>
  )
}


const Dashboard: React.FC = () => {
  const { user, signOut, loading: authLoading } = useAuth()
  const queryClient = useQueryClient(); // Cliente do React Query
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardData,
  })

  if (authLoading || isLoading) {
    return <div className="flex h-screen items-center justify-center">Carregando informações...</div>
  }

  if (!user) {
    return <Navigate to="/" replace />
  }
  
  if (isError) {
    return <div className="flex h-screen items-center justify-center text-red-500">Ocorreu um erro ao carregar os dados do dashboard.</div>
  }

  if (!data?.currentPeriod) {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="text-center">
                <p>Nenhum período de orçamento ativo encontrado para a data de hoje.</p>
                <p className="text-sm text-gray-500">Por favor, crie um novo período para começar.</p>
            </div>
        </div>
    )
  }
  
  const { currentPeriod, transactions } = data;

  const handleTransactionSuccess = () => {
    setIsAddTransactionOpen(false); // Fecha o modal
    // Invalida a query 'dashboardData', forçando o React Query a buscar os dados novamente.
    queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500">Bem-vindo(a) de volta, {user.email}!</p>
          </div>
          <Button variant={'outline'} onClick={signOut}>Sair</Button>
        </header>

        <main className="flex flex-col gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Orçamento para: {currentPeriod.name}</CardTitle>
              <CardDescription>
                Sua meta de gastos para o período de {new Date(currentPeriod.start_date).toLocaleDateString('pt-BR')} a {new Date(currentPeriod.end_date).toLocaleDateString('pt-BR')}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold tracking-tight text-green-600">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currentPeriod.budget_goal)}
              </p>
            </CardContent>
          </Card>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Transações Recentes</h2>
              <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
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
                    userId={user.id} 
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
                    transactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-medium">{tx.description || '-'}</TableCell>
                        <TableCell className="capitalize">{tx.category}</TableCell>
                        <TableCell>{new Date(tx.transaction_date).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell className="text-right font-mono text-red-500">
                          - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tx.amount)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-gray-500 py-8">
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
