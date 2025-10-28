import React, { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { periodsService, type CreatePeriodData } from '@/services/firebase'

interface AddPeriodDialogProps {
  onSuccess?: () => void
}

const AddPeriodDialog: React.FC<AddPeriodDialogProps> = ({ onSuccess }) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    budget_goal: '',
  })

  const createPeriodMutation = useMutation({
    mutationFn: async (newPeriod: CreatePeriodData) => {
      return await periodsService.createPeriod(newPeriod)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] })
      setIsOpen(false)
      resetForm()
      onSuccess?.()
    },
    onError: (error) => {
      console.error('Erro ao criar período:', error)
      alert('Não foi possível criar o período.')
    },
  })

  const resetForm = () => {
    setFormData({
      name: '',
      start_date: '',
      budget_goal: '',
    })
  }

  const generateCurrentMonthData = () => {
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

    setFormData({
      name: periodName,
      start_date: firstDay.toISOString().split('T')[0],
      budget_goal: '1000',
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.start_date || !formData.budget_goal) {
      alert('Preencha todos os campos obrigatórios.')
      return
    }

    if (!user) {
      alert('Usuário não autenticado.')
      return
    }

    createPeriodMutation.mutate({
      user_id: user.uid,
      name: formData.name,
      start_date: formData.start_date,
      budget_goal: parseFloat(formData.budget_goal),
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full"
          onClick={() => {
            generateCurrentMonthData()
            setIsOpen(true)
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Criar Novo Período
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Período de Orçamento</DialogTitle>
          <DialogDescription>
            Defina o nome, período e meta de orçamento para o novo período
            financeiro.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="start_date">Data de Início</Label>
            <Input
              id="start_date"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleInputChange}
              readOnly
              disabled
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Nome do Período *</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Ex: Janeiro 2025"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="budget_goal">Meta de Orçamento (R$) *</Label>
            <Input
              id="budget_goal"
              name="budget_goal"
              type="number"
              step="0.01"
              min="0"
              placeholder="1000.00"
              value={formData.budget_goal}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createPeriodMutation.isPending}
              className="flex-1"
            >
              {createPeriodMutation.isPending ? 'Criando...' : 'Criar Período'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddPeriodDialog
