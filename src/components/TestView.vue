<template>
    <div>
        <h1>Test View</h1>
        <p>This is a test view component.</p>
    </div>
</template>

<script>
export default {
    name: 'TestView',
    data() {
        return {
            message: 'Hello, Vue!'
        };
    }
};
</script>

<style scoped>
h1 {
    color: #42b983;
}
</style>