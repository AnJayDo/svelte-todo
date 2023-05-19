<script>
  // @ts-nocheck
  // import welcome from '$lib/images/svelte-welcome.webp';
  // import welcome_fallback from '$lib/images/svelte-welcome.png';
	import { onDestroy, onMount } from 'svelte';
  import ToDoItem from './ToDoItem.svelte';
  import { writable } from 'svelte/store';
  import { fromLocalStorage, toLocalStorage } from '$lib/store';
  import { v4 as uuidv4 } from 'uuid';
  import APP_CONSTANT from '$lib/constant'

  let isLoading = true;

  let newTodo = '';
  let toDoList = [];
  $: undoneTasks = toDoList.filter((item) => !item.status).length;
  $: completedTasks = toDoList.filter((item) => item.status).length;

	onMount(async () => {
		let store = writable(fromLocalStorage('to-do-app-tasks', []));
    store.subscribe(value => {
      toDoList = [...value];
      isLoading = false;
    })
	});

  /**
   * @param {Object} input
   * @param {string} input.value
   */
  function addToDo(input) {
    if (!event) return;
    const todo = {
      id: uuidv4(),
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

  function saveToDoList() {
		let store = writable(fromLocalStorage('to-do-app-tasks', toDoList));
    store.set(toDoList);
    toLocalStorage(store, 'to-do-app-tasks')
  }

  onDestroy(() => saveToDoList());
</script>

<svelte:window on:beforeunload={saveToDoList} />

<svelte:head>
  <title>To-Do {APP_CONSTANT.subfix}</title>
  <meta name="description" content={APP_CONSTANT.description} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@dovanminhan" />
  <meta name="twitter:title" content={'To-Do ' + APP_CONSTANT.subfix} />
  <meta name="twitter:description" content={APP_CONSTANT.description} />
  <meta name="twitter:image" content={APP_CONSTANT.domain + 'to-do-twitter-card.png'} />
  <meta
    name="twitter:image"
    content={APP_CONSTANT.domain + 'to-do-twitter-card.png'}
  />
  <meta
    property="og:url"
    content={APP_CONSTANT.domain}
  />
  <meta property="og:type" content="article" />
  <meta property="og:title" content={'About ' + APP_CONSTANT.subfix} />
  <meta
    property="og:description"
    content={APP_CONSTANT.description}
  />
  <meta
    property="og:image"
    content={APP_CONSTANT.domain + 'to-do-twitter-card.png'}
  />
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
        class="bg-transparent outline-none ml-2.5"
        placeholder="Your next task"
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
