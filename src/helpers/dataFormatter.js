const ticketNumber = (ticketNumber = '') => {
    return (ticketNumber).toLocaleString('en-US', {
        minimumIntegerDigits: 7, 
        useGrouping:false
      });
};

export {
    ticketNumber,
}