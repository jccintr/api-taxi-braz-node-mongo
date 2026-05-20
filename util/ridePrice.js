
export const calcularPrecoAte3Km = (distanciaKm) => {

    const taxaFixa = 10.00; // Preço fixo para até 3 km
    const precoPorKm = 2.00; // Preço por km acima de 3 km
    return (distanciaKm * precoPorKm) + taxaFixa;
   
}

export const calcularPrecoAcima3KmAbaixo20km = (distanciaKm) => {
     const taxaFixa = 10.00; // Preço fixo para até 3 km
    const precoPorKm = 5.00; // Preço por km acima de 3 km
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