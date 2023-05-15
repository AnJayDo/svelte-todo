<script>
  // @ts-nocheck

  import welcome from '$lib/images/svelte-welcome.webp';
  import welcome_fallback from '$lib/images/svelte-welcome.png';
  import ToDoItem from './ToDoItem.svelte';

  let newTodo = ''

  let uid = -1;
  let toDoList = [
    {
      id: uid++,
      title: 'To do item' + uid,
      createDate: new Date(),
      status: false,
    },
    {
      id: uid++,
      title: 'To do item' + uid,
      createDate: new Date(),
      status: false,
    },
    {
      id: uid++,
      title: 'To do item' + uid,
      createDate: new Date(),
      status: true,
    },
  ];

  /**
   * @param {Object} input
   * @param {string} input.value
   */
  function addToDo(input) {
    if (!event) return;
    const todo = {
      id: uid++,
      status: false,
      title: input.value,
      createDate: new Date(),
    };

    toDoList = [todo, ...toDoList];
    input.value = '';
  }

  /**
   * @param {Object} event
   * @param {Object} event.detail
   * @param {string | number} event.detail.id
   */
  function removeFromListByItem(event) {
    toDoList = toDoList.filter((item) => item.id !== event.detail.id);
  }

  /**
   * @param {Object} event
   * @param {Object} event.detail
   * @param {string | number} event.detail.id
   */
  function finishById(event) {
    let item = toDoList.find((item) => item.id === event.detail.id);
    // @ts-ignore
    if (!!item && item?.status) {
      removeFromListByItem({ detail: item });
      // item = {
      //   ...item,
      //   status: true,
      // };
      toDoList = toDoList.concat(item);
    }
  }

  /**
   * @param {Object} event
   * @param {Object} event.detail
   * @param {string | number} event.detail.id
   */
  function undoneById(event) {
    let item = toDoList.find((item) => item.id === event.detail.id);
    // @ts-ignore
    if (!!item) {
      removeFromListByItem({ detail: item });
      toDoList = [{
        ...item,
        status: false,
      }].concat(toDoList);
    }
  }

  $: undoneTasks = toDoList.filter((item) => !item.status).length;
  $: completedTasks = toDoList.filter((item) => item.status).length;
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
  <div class="main-container">
    <h1 class="text-3xl font-bold my-4">To-do List</h1>
    <h2 class="text-xl font-semibold mb-2">To be done: {undoneTasks}</h2>
    <ul class="todo-list">
      {#each toDoList.filter((item) => !item.status) as item (item.id)}
        <ToDoItem
          {item}
          on:doneItem={finishById}
          on:undoneItem={undoneById}
          on:deleteItem={removeFromListByItem}
        />
      {:else}
        <p
          class="w-full text-center mx-auto my-3 flex justify-center text-black opacity-75"
        >
          No tasks for now
        </p>
      {/each}
    </ul>
    <h2 class="text-xl font-semibold mb-2">Completed: {completedTasks}</h2>
    <ul class="todo-list">
      {#each toDoList.filter((item) => item.status) as item (item.id)}
        <ToDoItem
          {item}
          on:doneItem={finishById}
          on:undoneItem={undoneById}
          on:deleteItem={removeFromListByItem}
        />
      {/each}
    </ul>
    <div class="add-todo-container">
      <input
        class="bg-transparent outline-none"
        placeholder="what needs to be done?"
        bind:value={newTodo}
        on:keydown={(e) => e.key === 'Enter' && e.target && addToDo(e.target)}
      />
      <button class="add-btn" on:click={() => { addToDo({value: newTodo}); newTodo = ''; }}>Add</button>
    </div>
  </div>
</section>

<style lang="postcss">
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 0.6;
  }
</style>
