const fetchStatus = {
    value: 'clear',
    setLoading() {
        this.value = 'loading';
    },
    setFailed() {
        this.value = 'failed';
    },
    setClear() {
        this.value = 'clear';
    }
};

export default fetchStatus;