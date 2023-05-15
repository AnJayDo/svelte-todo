<script>
  import Icon from '@iconify/svelte';
  import { slide } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  /**
   * @type {{
   *    id: string | number;
   *    title: string;
   *    createDate: Date | string | number;
   *    status: boolean;
   *  }}
   */
  export let item;
  /** @function
   * @name deleteItem
   */
  /**
   * @param {number | string} id - id of the To-do item
   */
  export function deleteItem(id) {
    dispatch('deleteItem', {
      id,
    });
  }

  /** @function
   * @name handleClick
   */
  /**
   * @param {Object} event - event
   * @param {Object} item - To-do item
   * @param {boolean} item.status - status of the To-do item
   * @param {string | number} item.id - id of the To-do item
   */
  function handleClick(event, item) {
    if (!item.status) {
      console.log('Do undone')
      dispatch('undoneItem', item);
    } else {
      dispatch('doneItem', item);
    }
  }

  // function handleInput(event) {
  //   console.log(event)
  // }
</script>

  <li
    transition:slide={{duration: 400}}
    class={`todo-item ` + (!item.status ? '' : 'done')}
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="todo-clickable">
      <label class="todo-checkbox-container">
        <input
          class={`todo-checkbox before:content-['']`}
          type="checkbox"
          value={item.status}
          bind:checked={item.status}
          on:change={(e) => handleClick(e, item)}
        />
        <div class="todo-title">{item?.title}</div>
      </label>
    </div>
    <div class="btn-container">
      <button class="edit-btn svg-btn" on:click={() => deleteItem(item.id)}>
        <Icon
          color={'#ffffff'}
          class="not-hover"
          icon="ph:pencil-simple-duotone"
        />
        <Icon
          color={'#ffffff'}
          class="on-hover"
          icon="ph:pencil-simple-line-duotone"
        />
      </button>
      <button class="delete-btn svg-btn" on:click={() => deleteItem(item.id)}>
        <Icon color={'#ffffff'} class="not-hover" icon="mdi:delete-outline" />
        <Icon
          color={'#ffffff'}
          class="on-hover"
          icon="mdi:delete-empty-outline"
        />
      </button>
    </div>
  </li>