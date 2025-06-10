import Swal from 'sweetalert2';

// Configure global defaults for faster animations
Swal.mixin({
  showClass: {
    popup: 'animate__animated animate__fadeIn animate__faster',
    backdrop: 'swal2-backdrop-show',
    icon: 'swal2-icon-show'
  },
  hideClass: {
    popup: 'animate__animated animate__fadeOut animate__faster',
    backdrop: 'swal2-backdrop-hide',
    icon: 'swal2-icon-hide'
  },
  customClass: {
    container: 'font-sans',
    popup: 'rounded-lg',
    title: 'text-xl font-medium'
  },
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
  background: '#ffffff'
});

// Success alert
export const showSuccessAlert = (title: string, text: string) => {
  Swal.fire({
    icon: 'success',
    title,
    text,
    timer: 2000,
    showConfirmButton: false,
    background: '#ffffff',
    customClass: {
      container: 'font-sans',
      popup: 'rounded-lg',
      title: 'text-xl font-medium text-green-600',
      htmlContainer: 'text-gray-600'
    },
    showClass: {
      popup: 'animate__animated animate__fadeIn animate__faster'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOut animate__faster'
    }
  });
};

// Error alert
export const showErrorAlert = (title: string, text: string) => {
  Swal.fire({
    icon: 'error',
    title,
    text,
    timer: 3000,
    showConfirmButton: false,
    background: '#ffffff',
    customClass: {
      container: 'font-sans',
      popup: 'rounded-lg',
      title: 'text-xl font-medium text-red-600',
      htmlContainer: 'text-gray-600'
    },
    showClass: {
      popup: 'animate__animated animate__fadeIn animate__faster'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOut animate__faster'
    }
  });
};

// Warning alert
export const showWarningAlert = (title: string, message?: string) => {
  return Swal.fire({
    icon: 'warning',
    title,
    html: message,
    confirmButtonText: 'OK',
    background: '#ffffff',
    iconColor: '#FFA000', // Orange color
    customClass: {
      container: 'font-sans',
      popup: 'rounded-lg',
      title: 'text-xl font-medium',
      htmlContainer: 'text-gray-600',
      confirmButton: 'bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded'
    }
  });
};

// Confirmation dialog
export const showConfirmationDialog = (title: string, message: string) => {
  return Swal.fire({
    icon: 'question',
    title,
    html: message,
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    background: '#ffffff',
    iconColor: '#2196F3', // Blue color
    customClass: {
      container: 'font-sans',
      popup: 'rounded-lg',
      title: 'text-xl font-medium',
      htmlContainer: 'text-gray-600',
      confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded mr-2',
      cancelButton: 'bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded'
    }
  });
};

// Loading alert
export const showLoadingAlert = (title: string) => {
  return Swal.fire({
    title,
    allowOutsideClick: false,
    showConfirmButton: false,
    willOpen: () => {
      Swal.showLoading();
    },
    background: '#ffffff',
    customClass: {
      container: 'font-sans',
      popup: 'rounded-lg',
      title: 'text-xl font-medium'
    },
    showClass: {
      popup: 'animate__animated animate__fadeIn animate__faster'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOut animate__faster'
    }
  });
};

// Toast notification
export const showToast = (icon: 'success' | 'error' | 'warning' | 'info', title: string) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
    customClass: {
      popup: 'rounded-lg text-sm font-medium',
      title: 'text-sm'
    },
    showClass: {
      popup: 'animate__animated animate__fadeInDown animate__faster'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp animate__faster'
    }
  });

  return Toast.fire({
    icon,
    title,
    background: '#ffffff',
    iconColor: icon === 'success' ? '#4CAF50' : 
               icon === 'error' ? '#FF5252' : 
               icon === 'warning' ? '#FFA000' : '#2196F3',
    padding: '0.5rem 1rem'
  });
}; 