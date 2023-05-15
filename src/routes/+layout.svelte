<script>
	import Header from './Header.svelte';
	import './styles.scss';
</script>

<div class="app">
	<Header />
	<main>
		<slot />
	</main>
</div>

<style>
</style>
