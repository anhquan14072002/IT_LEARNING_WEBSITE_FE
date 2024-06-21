export const SUCCESS = (toast) => {
    toast.current.show({ severity: 'success', summary: 'Success', detail: 'You have success', life: 3000 });
}

export const ACCEPT = (toast) => {
    toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
}

export const REJECT = (toast) => {
    toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
}
