import React, { useEffect, useCallback } from 'react';
import ToolTip from './ToolTip';

const OdontogramaSVG = ({ handleElementClick }) => {
  const memoizedHandleElementClick = useCallback(handleElementClick, [handleElementClick]);

  // Esta función crea los dientes y los elementos gráficos del odontograma
  useEffect(() => {
    const dientesPermanentes = [
      { numero: 18, dx: 0 }, { numero: 17, dx: 45 }, { numero: 16, dx: 90 }, { numero: 15, dx: 135 },
      { numero: 14, dx: 180 }, { numero: 13, dx: 225 }, { numero: 12, dx: 270 }, { numero: 11, dx: 315 },
      { numero: 21, dx: 360 }, { numero: 22, dx: 405 }, { numero: 23, dx: 450 }, { numero: 24, dx: 495 },
      { numero: 25, dx: 540 }, { numero: 26, dx: 585 }, { numero: 27, dx: 630 }, { numero: 28, dx: 675 },
      { numero: 48, dx: 0 }, { numero: 47, dx: 45 }, { numero: 46, dx: 90 }, { numero: 45, dx: 135 },
      { numero: 44, dx: 180 }, { numero: 43, dx: 225 }, { numero: 42, dx: 270 }, { numero: 41, dx: 315 },
      { numero: 31, dx: 360 }, { numero: 32, dx: 405 }, { numero: 33, dx: 450 }, { numero: 34, dx: 495 },
      { numero: 35, dx: 540 }, { numero: 36, dx: 585 }, { numero: 37, dx: 630 }, { numero: 38, dx: 675 }
    ];

    const dientesDeciduosSuperiores = [
      { numero: 55, dx: 135 }, { numero: 54, dx: 180 }, { numero: 53, dx: 225 }, { numero: 52, dx: 270 }, { numero: 51, dx: 315 },
      { numero: 61, dx: 360 }, { numero: 62, dx: 405 }, { numero: 63, dx: 450 }, { numero: 64, dx: 495 }, { numero: 65, dx: 540 }
    ];

    const dientesDeciduosInferiores = [
      { numero: 85, dx: 135 }, { numero: 84, dx: 180 }, { numero: 83, dx: 225 }, { numero: 82, dx: 270 }, { numero: 81, dx: 315 },
      { numero: 71, dx: 360 }, { numero: 72, dx: 405 }, { numero: 73, dx: 450 }, { numero: 74, dx: 495 }, { numero: 75, dx: 540 }
    ];

    const caras = ['O', 'V', 'P', 'M', 'D'];
    const svg = document.getElementById('odontograma');

    function crearDientes(dientes, translateY, cuadrante) {
      dientes.forEach(diente => {
        const { numero, dx } = diente;
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("transform", `translate(${dx}, ${translateY})`);

        // Crear el texto del número del diente
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", "102");
        text.setAttribute("y", "77");
        text.setAttribute("font-family", "Arial");
        text.setAttribute("font-size", "12");
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("fill", "black");
        text.textContent = numero;
        g.appendChild(text);

        // Crear el rectángulo del diente
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        const dienteId = `${numero}`;  // Usar el número del diente como ID
        rect.setAttribute("id", dienteId);
        rect.setAttribute("stroke", "black");
        rect.setAttribute("stroke-width", "0.55");
        rect.setAttribute("fill", "transparent");
        rect.setAttribute("x", "93");
        rect.setAttribute("y", "93");
        rect.setAttribute("width", "17.5");
        rect.setAttribute("height", "17.5");
        g.appendChild(rect);

        // Crear superficies del diente (caras)
        caras.forEach(cara => {
          const caraRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
          let id = `${numero}(${cara})`;

          // Ajustes para ciertos dientes
          const dientesCambiar = [21, 22, 23, 24, 25, 26, 27, 28, 31, 32, 33, 34, 35, 36, 37, 38, 61, 62, 63, 64, 65, 71, 72,73,74,75];
          if (dientesCambiar.includes(numero)) {
            if (cara === 'M') id = `${numero}(D)`;
            else if (cara === 'D') id = `${numero}(M)`;
          }

          if (cuadrante === 'cuarto' || cuadrante === 'tercero') {
            if (cara === 'P') id = `${numero}(V)`;
            else if (cara === 'V') id = `${numero}(P)`;
          }

          caraRect.setAttribute("id", id);
          caraRect.setAttribute("stroke", "black");
          caraRect.setAttribute("stroke-width", "0.55");
          caraRect.setAttribute("fill", "transparent");

          switch (cara) {
            case 'O':
              caraRect.setAttribute("x", "93");
              caraRect.setAttribute("y", "93");
              caraRect.setAttribute("width", "17.5");
              caraRect.setAttribute("height", "17.5");
              break;
            case 'V':
              caraRect.setAttribute("x", "93");
              caraRect.setAttribute("y", "85.8");
              caraRect.setAttribute("width", "17.5");
              caraRect.setAttribute("height", "6.875");
              break;
            case 'P':
              caraRect.setAttribute("x", "93");
              caraRect.setAttribute("y", "110");
              caraRect.setAttribute("width", "17.5");
              caraRect.setAttribute("height", "6.875");
              break;
            case 'M':
              caraRect.setAttribute("x", "111");
              caraRect.setAttribute("y", "93");
              caraRect.setAttribute("width", "6.875");
              caraRect.setAttribute("height", "16.5");
              break;
            case 'D':
              caraRect.setAttribute("x", "85.8");
              caraRect.setAttribute("y", "93");
              caraRect.setAttribute("width", "6.875");
              caraRect.setAttribute("height", "16.5");
              break;
            default:
              console.warn(`Unhandled case: ${cara}`);
              break;
          }

          g.appendChild(caraRect);
        });

        // Crear elipses adicionales (CV, CP)
        ['CV', 'CP'].forEach(tipo => {
          const ellipse = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
          ellipse.setAttribute("stroke", "black");
          ellipse.setAttribute("stroke-width", "0.55");
          ellipse.setAttribute("fill", "transparent");

          let id;
          if (tipo === 'CV') {
            ellipse.setAttribute("cx", "102");
            ellipse.setAttribute("cy", "82");
            ellipse.setAttribute("rx", "8.25");
            ellipse.setAttribute("ry", "3.4375");
          } else if (tipo === 'CP') {
            ellipse.setAttribute("cx", "102");
            ellipse.setAttribute("cy", "120");
            ellipse.setAttribute("rx", "8.25");
            ellipse.setAttribute("ry", "3.4375");
          }

          if (cuadrante === 'cuarto' || cuadrante === 'tercero') {
            if (tipo === 'CV') id = `${numero}(CP)`;
            else if (tipo === 'CP') id = `${numero}(CV)`;
          } else {
            id = `${numero}(${tipo})`;
          }

          ellipse.setAttribute("id", id);
          g.appendChild(ellipse);
        });

        svg.appendChild(g);
      });
    }

    // Crear dientes permanentes, deciduos y ajustarlos según el cuadrante
    crearDientes(dientesPermanentes.slice(0, 16), 0, 'primer');
    crearDientes(dientesDeciduosSuperiores, 70, 'primer');
    crearDientes(dientesDeciduosInferiores.slice(0, 5), 140, 'cuarto');
    crearDientes(dientesDeciduosInferiores.slice(5), 140, 'tercero');
    crearDientes(dientesPermanentes.slice(16), 210, 'cuarto');
  }, []);

  // Agregar eventos de click, mouseenter y mouseleave a cada diente
  useEffect(() => {
    const elements = document.querySelectorAll('rect, ellipse');

    elements.forEach(element => {
      element.addEventListener('mouseenter', ToolTip.showTooltip);
      element.addEventListener('mouseleave', ToolTip.hideTooltip);
      element.addEventListener('click', memoizedHandleElementClick);
    });

    return () => {
      elements.forEach(element => {
        element.removeEventListener('mouseenter', ToolTip.showTooltip);
        element.removeEventListener('mouseleave', ToolTip.hideTooltip);
        element.removeEventListener('click', memoizedHandleElementClick);
      });
    };
  }, [memoizedHandleElementClick]);

  return <svg id="odontograma" width="600" height="300" viewBox="0 0 1000 400"></svg>;
};

export default OdontogramaSVG;