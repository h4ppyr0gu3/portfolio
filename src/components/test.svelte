<script>
	let count = 0;

	function incrementCount() {
		count += 1;
	}
</script>

<button on:click={incrementCount}  class='p-4 m-4 rounded bg-sky-400 border'>
	Clicked {count} {count === 1 ? 'time' : 'times'}
</button>
