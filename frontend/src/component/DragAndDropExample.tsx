import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd"
import { useState } from "react"

type Task = {
  id: string
  content: string
}

type Column = {
  id: string
  title: string
  taskIds: string[]
}

type State = {
  tasks: Record<string, Task>
  columns: Record<string, Column>
  columnOrder: string[]
}

const initialData: State = {
  tasks: {
    "1": { id: "1", content: "Task 1" },
    "2": { id: "2", content: "Task 2" },
    "3": { id: "3", content: "Task 3" },
    "4": { id: "4", content: "Task 4" },
  },
  columns: {
    todo: {
      id: "todo",
      title: "To Do",
      taskIds: ["1", "2"],
    },
    inprogress: {
      id: "inprogress",
      title: "In Progress",
      taskIds: ["3"],
    },
    done: {
      id: "done",
      title: "Done",
      taskIds: ["4"],
    },
  },
  columnOrder: ["todo", "inprogress", "done"],
}

export const DragAndDropExample = () => {
  const [state, setState] = useState<State>(initialData)

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result

    if (!destination) return

    // If dropped in same place → do nothing
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return
    }

    const start = state.columns[source.droppableId]
    const finish = state.columns[destination.droppableId]

    // ✅ CASE 1: Same column
    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds)
      const [moved] = newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, moved)

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      }

      setState({
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn,
        },
      })
      return
    }

    // ✅ CASE 2: Moving between columns
    const startTaskIds = Array.from(start.taskIds)
    const [moved] = startTaskIds.splice(source.index, 1)

    const finishTaskIds = Array.from(finish.taskIds)
    finishTaskIds.splice(destination.index, 0, moved)

    const newStart = {
      ...start,
      taskIds: startTaskIds,
    }

    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    }

    setState({
      ...state,
      columns: {
        ...state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    })
  }

  return (
    <>
      <div>DragAndDropExample</div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div style={{ display: "flex", gap: "16px" }}>
          {state.columnOrder.map((columnId) => {
            const column = state.columns[columnId]
            const tasks = column.taskIds.map((taskId) => state.tasks[taskId])

            return (
              <Droppable droppableId={column.id} key={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      background: "#f4f5f7",
                      padding: 10,
                      width: 250,
                      minHeight: 400,
                    }}
                  >
                    <h3>{column.title}</h3>

                    {tasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              padding: 10,
                              margin: "8px 0",
                              background: "white",
                              borderRadius: 4,
                              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                              ...provided.draggableProps.style,
                            }}
                          >
                            {task.content}
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            )
          })}
        </div>
      </DragDropContext>
    </>
  )
}
