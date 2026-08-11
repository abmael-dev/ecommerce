import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '@/services/adminService'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { Card, CardContent } from '@/components/ui/Card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import { ImageUploader } from '@/components/ui/ImageUploader'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'
import { Plus } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'

export const AdminProductsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('jaquetas')
  const [uploadedPreviews, setUploadedPreviews] = useState<string[]>([])
  
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  const { data: products } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => adminService.getProducts(),
  })

  const createMutation = useMutation({
    mutationFn: (newProduct: any) => adminService.createProduct(newProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      addToast({
        type: 'success',
        title: 'Produto Cadastrado!',
        message: 'Produto cadastrado com sucesso e submetido ao backend.',
      })
      setIsModalOpen(false)
      setName('')
      setPrice('')
      setUploadedPreviews([])
    },
  })

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !price) return

    createMutation.mutate({
      name,
      price: Number(price),
      category,
      images: uploadedPreviews.length > 0 ? uploadedPreviews : undefined,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Gerenciamento de Produtos</h1>
          <p className="text-xs text-slate-500 mt-1">Gerencie catálogo, preços e estoque de variantes</p>
        </div>

        <Button variant="primary" onClick={() => setIsModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Novo Produto
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Avaliação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="flex items-center gap-3 font-bold">
                    <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                    <span>{p.name}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="neutral">{p.category}</Badge>
                  </TableCell>
                  <TableCell>{p.brand}</TableCell>
                  <TableCell className="font-bold">{formatCurrency(p.price)}</TableCell>
                  <TableCell>★ {p.rating}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal for Creating Product */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Cadastrar Novo Produto" maxWidth="lg">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Nome do Produto" value={name} onChange={(e) => setName(e.target.value)} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Preço (R$)" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
            <Select
              label="Categoria"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: 'jaquetas', label: 'Jaquetas' },
                { value: 'camisas', label: 'Camisetas' },
                { value: 'calcas', label: 'Calças' },
                { value: 'tenis', label: 'Tênis' },
                { value: 'acessorios', label: 'Acessórios' },
              ]}
            />
          </div>

          <ImageUploader
            onImagesSelected={(_, previews) => setUploadedPreviews(previews)}
            label="Upload de Imagens do Produto"
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" isLoading={createMutation.isPending}>
              Salvar Produto
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
