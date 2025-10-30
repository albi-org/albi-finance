import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Transaction } from '@/types'
import { Timestamp } from 'firebase/firestore'
import React, { useState, useEffect } from 'react'

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Array<Transaction>>([])

  useEffect(() => {
    // Mock de três transações
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        user_id: 'user_123',
        description: 'Compra de alimentos e produtos de limpeza',
        amount: 150.75,
        category: 'groceries',
        transaction_date: Timestamp.fromDate(new Date('2024-10-25')),
      },
      {
        id: '2',
        user_id: 'user_123',
        description: 'Combustível para o carro',
        amount: 85.4,
        category: 'transport',
        transaction_date: Timestamp.fromDate(new Date('2024-10-28')),
      },
      {
        id: '3',
        user_id: 'user_123',
        description: 'Jantar em restaurante',
        amount: 120.0,
        category: 'entertainment',
        transaction_date: Timestamp.fromDate(new Date('2024-10-29')),
      },
    ]
    setTransactions(mockTransactions)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Nome</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Quantidade</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.id}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>R$ {transaction.amount.toFixed(2)}</TableCell>
              <TableCell>{transaction.category}</TableCell>
              <TableCell>
                {transaction.transaction_date
                  .toDate()
                  .toLocaleDateString('pt-BR')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default Dashboard
