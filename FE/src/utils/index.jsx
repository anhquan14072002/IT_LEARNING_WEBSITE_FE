export const formatDate = (value) => {
  if (!value) return '';

  const options = {
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  };

  const date = new Date(value);
  const formattedDate = date.toLocaleString('vi-VN', options);

  return formattedDate.replace('lúc ', '');
};


export const SUCCESS = (toast, msg = "") => {
    toast.current.show({
      severity: 'success',
      summary: 'Success',
      detail: msg || 'You have succeeded',
      life: 3000
    });
  }
  
  export const ACCEPT = (toast, msg = "") => {
    toast.current.show({
      severity: 'info',
      summary: 'Confirmed',
      detail: msg || 'You have accepted',
      life: 3000
    });
  }
  
  export const REJECT = (toast, msg = "") => {
    toast.current.show({
      severity: 'warn',
      summary: 'Rejected',
      detail: msg || 'You have rejected',
      life: 3000
    });
  }
  