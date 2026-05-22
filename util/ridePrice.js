
export const calcularPrecoAte3Km = (distanciaKm) => {

    const taxaFixa = 10.00;
    const precoPorKm = 2.00; 

    return (distanciaKm * precoPorKm) + taxaFixa;
   
}

export const calcularPrecoAcima3KmAbaixo20km = (distanciaKm) => {
    const taxaFixa = 10.00; 
    let precoPorKm = 5.00; 

    if(distanciaKm>6 && distanciaKm <= 6.6) precoPorKm = 4.00; // bs
    if(distanciaKm>7.9 && distanciaKm <= 8.4) precoPorKm = 2.40;  //dias
    if(distanciaKm>13.4 && distanciaKm <= 14.2) precoPorKm = 2.14;  // cv

    return (distanciaKm * precoPorKm) + taxaFixa;
}

export const calcularPrecoAcima20Km = (distanciaKm, config = {}) => {
    const {
        precoMinimo = 12.00,
        multiplicador = 1.0,
       } = config;

    let preco = 0;

    if (distanciaKm <= 2) {
        // Quadrática ajustada para os 3 pontos desejados
        const a = -0.95238;
        const b = 42.381;
        const c = -374.286;
        
        preco = a * distanciaKm * distanciaKm + b * distanciaKm + c;
    } else {
        // Linear após 25km (preço por km adicional menor)
        const precoAos25 = 90.0;
        const taxaPorKmAdicional = 1.80;   // Ajuste este valor conforme necessário
        
        preco = precoAos25 + taxaPorKmAdicional * (distanciaKm - 25);
    }

    // Aplicar piso mínimo
    preco = Math.max(preco, precoMinimo);
    
    // Multiplicador dinâmico (surge, chuva, horário de pico)
    preco = preco * multiplicador;

    //return Math.round(preco * 100) / 100;
    return preco
}