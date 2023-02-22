import toast from 'react-hot-toast';

export function showNotification(msgType , msgTitle){
   if(msgType === 'success') {
    toast.success(msgTitle , {
        duration: 4000,
        position: 'top-center',
      });
   }
   else if(msgType === 'error'){
    toast.error(msgTitle , {
        duration: 4000,
        position: 'top-center',
        style : {
            color : '#fff'
        }
      });
   }
}