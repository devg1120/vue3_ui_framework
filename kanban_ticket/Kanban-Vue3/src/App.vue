<script>
import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';

export default {
  setup() {
    const items = ref([
      // unique ID to identify each item - Title to render on screen - list it belongs to
      { id: uuidv4(), title: 'Style registration', list: 1 },
      { id: uuidv4(), title: 'Help with designs', list: 1 },
      { id: uuidv4(), title: 'Test dashboard', list: 1 },
      { id: uuidv4(), title: 'Finish Kanban Board', list: 1 },
    ]);

    // holds color value for each board
    const boards = ref([
      { id: 1, name: 'Backlog', color: '#f45a5f' },
      { id: 2, name: 'In Progress', color: '#fea126' },
      { id: 3, name: 'Tested', color: '#1eba46' },
      { id: 4, name: 'Done', color: '#5caff1' },
    ]);

    const newBoardName = ref('');

    const getBoardId = (boardId) => {
      return `board-${boardId}`;
    };

    const addBoard = () => {
      const boardName = newBoardName.value.trim();
      if (boardName) {
        const newBoard = {
          id: uuidv4(),
          name: boardName,
          color: '#fff',
        };
        boards.value.push(newBoard);
        newBoardName.value = '';
      }
    };

    const newTaskTitle = ref('');

    const getList = (list) => {
      // filters list - only returns item if their list matches argument
      return items.value.filter((item) => item.list == list);
    };

    const startDrag = (event, item, boardId) => {
      if (item) {
        event.dataTransfer.setData('itemID', item.id);
        event.dataTransfer.setData('listID', item.list);
      } else if (boardId) {
        event.dataTransfer.setData('boardID', boardId);
      }
    };

    const onDrop = (event, list, board) => {
      const itemID = event.dataTransfer.getData('itemID');
      const boardID = event.dataTransfer.getData('boardID');

      if (itemID) {
        const item = items.value.find((item) => item.id == itemID);
        item.list = list;
      } else if (boardID) {
        const boardIndex = boards.value.findIndex((b) => b.id == boardID);
        const targetIndex = boards.value.findIndex((b) => b.id == board);
        const [removedBoard] = boards.value.splice(boardIndex, 1);
        boards.value.splice(targetIndex, 0, removedBoard);
      }
    };

    // Handles new Tasks 
    const addTask = () => {
      const taskTitle = newTaskTitle.value.trim();
      if (taskTitle) {
        const newTask = {
          // Unique ID
          id: Date.now(),
          title: taskTitle,
          // adds Task to the backlog list by default 
          list: 1,
        };
        items.value.push(newTask);
        // Empty field for input
        newTaskTitle.value = '';
      }
    };

    const getBoardStyle = (boardId) => {
      const board = boards.value.find((board) => board.name === boardId);
      if (board) {
        return { backgroundColor: board.color, minHeight: '340px' };
      }
    };

    // Allows access to template
    return {
      items,
      getList,
      onDrop,
      startDrag,
      newTaskTitle,
      addTask,
      boards,
      newBoardName,
      getBoardId,
      addBoard,
      getBoardStyle,
    }
  }
};

</script>

<template>
  <header>
    <h1>
      Kanban Board
    </h1>
  </header>

  <!-- New Board -->
  <div class="board-form">
    <input type="text" v-model="newBoardName" placeholder="Add a new Board">
    <button @click="addBoard">Add Board</button>
  </div>

  <!-- New Task -->
  <div class="task-form">
    <input type="text" v-model="newTaskTitle" placeholder="Enter a new Task">
    <button @click="addTask">Add Task</button>
  </div>

  <!-- Boards -->
  <div class="kanban-row">
    <div v-for="board in boards" :key="board.id" :id="getBoardId(board.id)" @drop="onDrop($event, board.id)"
      @dragenter.prevent @dragover.prevent class="kanban-board-base" :style="getBoardStyle(board.name)" draggable="true"
      @dragstart="startDrag($event, null, board.id)">
      <div>
        <h2>{{ board.name }}</h2>
        <div>
          <div>
            Change Color
          </div>
          <div class="color-picker">
            <input type="color" v-model="board.color">
          </div>
        </div>
      </div>
      <div>
        <div v-for="item in getList(board.id)" :key="item.id" class="drag-el" draggable="true"
          @dragstart="startDrag($event, item)">{{ item.title }}</div>
      </div>
    </div>
  </div>
</template>

<style>
/* global styles */
* {
  font-family: Helvetica, sans-serif;
  text-align: center;
  font-weight: bold;
}

.task-form {
  margin-bottom: 20px;
  padding-top: 20px;
}


/* styles for kanban board */
.kanban-board {
  background-color: #ecf0f1;
  min-height: 10px;
}

.kanban-row {
  display: flex;
  justify-content: space-evenly;
  gap: 20px;
}

.kanban-board-base {
  border-radius: 15px;
  padding: 10px;
  min-height: 340px;
}

.drag-el {
  opacity: 60%;
  background-color: white;
  padding: 5px;
  margin-bottom: 10px;
  border-radius: 5px;
  color: black;
}

;

.drag-el:nth-last-of-type(1) {
  margin-bottom: 0;
}

.color-picker {
  padding-bottom: 5px;
}
</style>