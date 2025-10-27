import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import {
  transactionsService,
  type TransactionCategory,
  type CreateTransactionData,
} from '@/services/firebase'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DialogFooter } from './ui/dialog'
import { DialogClose } from '@radix-ui/react-dialog'

interface AddTransactionFormProps {
  periodId: string
  userId: string
  onSuccess: () => void
}

function AddTransactionForm({
  periodId,
  userId,
  onSuccess,
}: AddTransactionFormProps) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<TransactionCategory | ''>('')

  const addTransactionMutation = useMutation({
    mutationFn: async (newTransaction: CreateTransactionData) => {
      await transactionsService.createTransaction(newTransaction)
    },
    onSuccess: () => {
      console.log('Transação adicionada com sucesso!')
      onSuccess() // Chama a função do pai para fechar o modal e revalidar os dados
    },
    onError: (error) => {
      console.error('Erro ao adicionar transação:', error)
      alert('Não foi possível adicionar a transação.')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description || !amount || !category) {
      alert('Por favor, preencha todos os campos.')
      return
    }

    addTransactionMutation.mutate({
      description,
      amount: parseFloat(amount),
      category,
      period_id: periodId,
      user_id: userId,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">
          Descrição
        </Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="amount" className="text-right">
          Valor
        </Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="category" className="text-right">
          Categoria
        </Label>
        <Select
          onValueChange={(value) => setCategory(value as TransactionCategory)}
          value={category}
        >
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
          <Button type="button" variant="outline">
            Cancelar
          </Button>
        </DialogClose>
        <Button type="submit" disabled={addTransactionMutation.isPending}>
          {addTransactionMutation.isPending
            ? 'Salvando...'
            : 'Salvar Transação'}
        </Button>
      </DialogFooter>
    </form>
  )
}

export default AddTransactionForm
