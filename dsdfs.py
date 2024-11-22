import numpy as np
from scipy.optimize import linprog

def obtener_valores_funcion_objetivo():
    print("Ingrese los coeficientes de la función objetivo (debe ser de la forma c1, c2, ... cn para maximizar c1*x1 + c2*x2 + ... + cn*xn):")
    c = list(map(float, input("Coeficientes de la función objetivo (separados por espacios): ").split()))
    return [-i for i in c]  # Convertir a forma de minimización

def obtener_valores_restricciones():
    print("\nIngrese las restricciones de la forma Ax <= b:")
    A = []
    b = []
    
    while True:
        # Pedir al usuario que ingrese una restricción
        restriccion = input("Ingrese una restricción (en la forma 'coef1 coef2 ... coefn <= valor) o 'fin' para terminar: ")
        if restriccion.lower() == 'fin':
            break
        coeficientes, valor = restriccion.split("<=")
        coeficientes = list(map(float, coeficientes.split()))
        A.append(coeficientes)
        b.append(float(valor))
    
    return np.array(A), np.array(b)

def obtener_límites_variables():
    print("\nIngrese los límites para las variables. Para cada variable, ingrese el valor mínimo y máximo en la forma: (min, max).")
    x_bounds = []
    while True:
        variable = input("Ingrese el límite para la variable (en la forma 'min max') o 'fin' para terminar: ")
        if variable.lower() == 'fin':
            break
        min_val, max_val = map(float, variable.split())
        x_bounds.append((min_val, max_val))
    
    return x_bounds

# Función principal que resuelve el problema de programación lineal
def resolver_programa_lineal():
    # Ingresar los coeficientes de la función objetivo
    c = obtener_valores_funcion_objetivo()

    # Ingresar las restricciones
    A, b = obtener_valores_restricciones()

    # Ingresar los límites de las variables
    x_bounds = obtener_límites_variables()

    # Resolver el problema de programación lineal usando el método Simplex
    result = linprog(c, A_ub=A, b_ub=b, bounds=x_bounds, method='simplex')

    # Mostrar los resultados
    if result.success:
        print("\nSolución óptima encontrada:")
        for i, valor in enumerate(result.x):
            print(f"Variable x{i+1} = {valor:.2f}")
        print(f"\nValor máximo de la función objetivo: {result.fun:.2f}")
    else:
        print("\nNo se encontró una solución óptima.")

# Ejecutar la función principal
if __name__ == "__main__":
    resolver_programa_lineal()
