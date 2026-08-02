'use client';

import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { api } from '../../../lib/api';

interface Client {
  id: string;
  name: string;
  company: string | null;
  status: string;
}

// Стандартные этапы воронки (в реальном проекте можно получать с бэкенда GET /funnel/stages)
const FUNNEL_STAGES = [
  'Новый лид',
  'Первый звонок',
  'Связались',
  'Выявление потребностей',
  'Отправлено КП',
  'Переговоры',
  'Ожидает оплату',
  'Оплачено'
];

type ColumnsType = Record<string, Client[]>;

export default function FunnelPage() {
  const [columns, setColumns] = useState<ColumnsType>({});
  const [isLoading, setIsLoading] = useState(true);

  // Для обхода проблемы гидратации dnd в Next.js
  const [isBrowser, setIsBrowser] = useState(false);
  useEffect(() => setIsBrowser(true), []);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/clients');
      const clients: Client[] = res.data;

      // Группируем клиентов по статусам
      const initialColumns: ColumnsType = {};
      FUNNEL_STAGES.forEach(stage => {
        initialColumns[stage] = clients.filter(c => c.status === stage);
      });

      // Если есть клиенты с нестандартным статусом, кидаем их в "Новый лид"
      clients.forEach(c => {
        if (!FUNNEL_STAGES.includes(c.status)) {
          initialColumns['Новый лид'].push(c);
        }
      });

      setColumns(initialColumns);
    } catch (error) {
      console.error('Ошибка загрузки клиентов для воронки', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceColumn = [...columns[source.droppableId]];
    const destColumn = [...columns[destination.droppableId]];
    const [movedClient] = sourceColumn.splice(source.index, 1);

    // Оптимистичное обновление UI
    movedClient.status = destination.droppableId;
    destColumn.splice(destination.index, 0, movedClient);

    setColumns({
      ...columns,
      [source.droppableId]: sourceColumn,
      [destination.droppableId]: destColumn,
    });

    // Отправка запроса на бэкенд
    try {
      await api.patch(`/clients/${draggableId}`, { status: destination.droppableId });
    } catch (error) {
      console.error('Ошибка обновления статуса', error);
      // В случае ошибки возвращаем как было
      fetchClients(); 
    }
  };

  if (!isBrowser) return null;

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white tracking-tight">Воронка продаж</h1>
        <p className="text-sm text-neutral-400 mt-1">Перетаскивайте карточки клиентов для смены статуса</p>
      </div>

      {isLoading ? (
        <div className="text-neutral-500">Загрузка воронки...</div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4 h-full">
            {FUNNEL_STAGES.map((stageId) => (
              <div key={stageId} className="flex flex-col min-w-[280px] w-[280px] bg-neutral-900/50 rounded-xl">
                <div className="p-4 flex items-center justify-between border-b border-neutral-800">
                  <h3 className="text-sm font-medium text-neutral-300">{stageId}</h3>
                  <span className="text-xs bg-neutral-800 text-neutral-400 px-2 py-1 rounded-full">
                    {columns[stageId]?.length || 0}
                  </span>
                </div>

                <Droppable droppableId={stageId}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 p-3 space-y-3 min-h-[150px] transition-colors ${
                        snapshot.isDraggingOver ? 'bg-neutral-800/30' : ''
                      }`}
                    >
                      {columns[stageId]?.map((client, index) => (
                        <Draggable key={client.id} draggableId={client.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-4 bg-neutral-950 border rounded-lg shadow-sm transition-shadow ${
                                snapshot.isDragging ? 'border-neutral-500 shadow-xl z-50' : 'border-neutral-800 hover:border-neutral-700'
                              }`}
                            >
                              <div className="font-medium text-sm text-neutral-100">{client.name}</div>
                              {client.company && (
                                <div className="text-xs text-neutral-500 mt-1">{client.company}</div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}
    </div>
  );
}