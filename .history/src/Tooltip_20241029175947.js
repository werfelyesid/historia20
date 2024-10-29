const ToolTip = {
    showTooltip: (event) => {
      const elementId = event.target.id;  // Obtener el ID del elemento que activa el tooltip
      let tooltip = document.getElementById('tooltip');
  
      // Si el tooltip no existe, crearlo
      if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'tooltip';
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
  
  export default ToolTip;