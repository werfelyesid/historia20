const ToolTip = {
    showTooltip: (event) => {
      const elementId = event.target.id;  // Obtener el ID del elemento que activa el tooltip
      let tooltip = document.getElementById('tooltip');
  
      // Si el tooltip no existe, crearlo
      if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'tooltip';
        tooltip.style.position = 'absolute';
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '5px';
        tooltip.style.borderRadius = '5px';
        tooltip.style.pointerEvents = 'none'; // Para que el tooltip no interfiera con los eventos del mouse
        tooltip.style.zIndex = '1000'; // Asegúrate de que el tooltip esté por encima de otros elementos
        document.body.appendChild(tooltip);
      }
  
      if (typeof elementId === 'string') {
        const [diente, cara] = elementId.split('(');
        tooltip.textContent = `Diente: ${diente}${cara ? `, Cara: ${cara.replace(')', '')}` : ''}`;
      } else {
        tooltip.textContent = '';
      }
  
      tooltip.style.display = 'block';
      tooltip.style.left = `${event.pageX + 10}px`; // Ajusta la posición del tooltip respecto al mouse
      tooltip.style.top = `${event.pageY + 10}px`;
    },
  
    hideTooltip: () => {
      const tooltip = document.getElementById('tooltip');
      if (tooltip) {
        tooltip.style.display = 'none';
      }
    }
  };
  
  // Agregar estilos CSS para el tooltip
  const style = document.createElement('style');
  style.textContent = `
    #tooltip {
      position: absolute;
      background-color: rgba(0, 0, 0, 0.75);
      color: white;
      padding: 5px;
      border-radius: 5px;
      pointer-events: none; /* Para que el tooltip no interfiera con los eventos del mouse */
      z-index: 1000; /* Asegúrate de que el tooltip esté por encima de otros elementos */
    }
  `;
  document.head.appendChild(style);
  
  export default ToolTip;