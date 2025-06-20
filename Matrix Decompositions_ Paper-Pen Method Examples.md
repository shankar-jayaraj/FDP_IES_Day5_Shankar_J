<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" class="logo" width="120"/>

## Matrix Decompositions: Paper-Pen Method Examples

Below are step-by-step manual calculations for each decomposition using small matrices (2×2 or 3×3). Each example is solved using fundamental linear algebra techniques without computational tools.

### 1. **LU Decomposition (LR Decomposition)**

**Objective:** Factorize matrix $A$ into lower triangular matrix $L$ and upper triangular matrix $U$ such that $A = LU$.
**Example Matrix:**

$$
A = \begin{bmatrix}
2 & -1 \\
-4 & 6 
\end{bmatrix}
$$

**Steps:**

1. **Row Reduction to Upper Triangular ($U$):**
    - $R_2 \leftarrow R_2 + 2R_1$:

$$
U = \begin{bmatrix}
2 & -1 \\
0 & 4 
\end{bmatrix}
$$
2. **Extract $L$ from Row Operations:**
    - Multiplier: $l_{21} = -2$ (from step 1).

$$
L = \begin{bmatrix}
1 & 0 \\
-2 & 1 
\end{bmatrix}
$$
3. **Verify $A = LU$:**

$$
LU = \begin{bmatrix}
1 & 0 \\
-2 & 1 
\end{bmatrix}
\begin{bmatrix}
2 & -1 \\
0 & 4 
\end{bmatrix} = 
\begin{bmatrix}
2 & -1 \\
-4 & 6 
\end{bmatrix} = A
$$

---

### 2. **QR Decomposition**

**Objective:** Factorize $A$ into orthogonal matrix $Q$ and upper triangular matrix $R$ such that $A = QR$.
**Example Matrix:**

$$
A = \begin{bmatrix}
1 & 1 \\
1 & 0 
\end{bmatrix}
$$

**Steps:**

1. **Gram-Schmidt Orthogonalization:**
    - $\mathbf{a_1} = [^2][^2]^T$, $\mathbf{a_2} = [^2]^T$.
    - $\mathbf{u_1} = \mathbf{a_1} = [^2][^2]^T$.
    - $\mathbf{u_2} = \mathbf{a_2} - \text{proj}_{\mathbf{u_1}} \mathbf{a_2} = [^2]^T - \frac{[^2] \cdot [^2][^2]}{[^2][^2] \cdot [^2][^2]} [^2][^2]^T = [^2]^T - \frac{1}{2}[^2][^2]^T = [\frac{1}{2}, -\frac{1}{2}]^T$.
2. **Normalize to get $Q$:**

$$
Q = \begin{bmatrix}
\frac{1}{\sqrt{2}} & \frac{1}{\sqrt{2}} \\
\frac{1}{\sqrt{2}} & -\frac{1}{\sqrt{2}}
\end{bmatrix}
$$
3. **Compute $R = Q^TA$:**

$$
R = \begin{bmatrix}
\frac{1}{\sqrt{2}} & \frac{1}{\sqrt{2}} \\
\frac{1}{\sqrt{2}} & -\frac{1}{\sqrt{2}}
\end{bmatrix}^T
\begin{bmatrix}
1 & 1 \\
1 & 0 
\end{bmatrix} = 
\begin{bmatrix}
\sqrt{2} & \frac{1}{\sqrt{2}} \\
0 & \frac{1}{\sqrt{2}}
\end{bmatrix}
$$

---

### 3. **Symmetric Eigendecomposition (QVQᵀ)**

**Objective:** Diagonalize symmetric matrix $A$ as $A = QVQ^T$ where $Q$ is orthogonal and $V$ is diagonal.
**Example Matrix:**

$$
A = \begin{bmatrix}
4 & 1 \\
1 & 4 
\end{bmatrix}
$$

**Steps:**

1. **Find Eigenvalues:**
    - Solve $\det(A - \lambda I) = 0$:

$$
\det \begin{bmatrix}
4-\lambda & 1 \\
1 & 4-\lambda 
\end{bmatrix} = (4-\lambda)^2 - 1 = 0 \implies \lambda_1=5, \lambda_2=3.
$$
2. **Find Eigenvectors:**
    - For $\lambda_1=5$: $(A - 5I)\mathbf{v} = 0 \implies \mathbf{v_1} = [^2][^2]^T$.
    - For $\lambda_2=3$: $(A - 3I)\mathbf{v} = 0 \implies \mathbf{v_2} = [-1, 1]^T$.
3. **Normalize Eigenvectors to form $Q$:**

$$
Q = \begin{bmatrix}
\frac{1}{\sqrt{2}} & -\frac{1}{\sqrt{2}} \\
\frac{1}{\sqrt{2}} & \frac{1}{\sqrt{2}}
\end{bmatrix}
$$
4. **Construct $V$ and Verify $A = QVQ^T$:**

$$
V = \begin{bmatrix}
5 & 0 \\
0 & 3 
\end{bmatrix}, \quad
QVQ^T = \begin{bmatrix}
\frac{1}{\sqrt{2}} & -\frac{1}{\sqrt{2}} \\
\frac{1}{\sqrt{2}} & \frac{1}{\sqrt{2}}
\end{bmatrix}
\begin{bmatrix}
5 & 0 \\
0 & 3 
\end{bmatrix}
\begin{bmatrix}
\frac{1}{\sqrt{2}} & \frac{1}{\sqrt{2}} \\
-\frac{1}{\sqrt{2}} & \frac{1}{\sqrt{2}}
\end{bmatrix} = A.
$$

---

### 4. **General Eigendecomposition (XVX⁻¹)**

**Objective:** Diagonalize matrix $A$ as $A = XVX^{-1}$ where $X$ is invertible and $V$ is diagonal.
**Example Matrix:**

$$
A = \begin{bmatrix}
2 & 1 \\
0 & 3 
\end{bmatrix}
$$

**Steps:**

1. **Find Eigenvalues:**
    - $\det(A - \lambda I) = (2-\lambda)(3-\lambda) = 0 \implies \lambda_1=2, \lambda_2=3$.
2. **Find Eigenvectors:**
    - For $\lambda_1=2$: $(A - 2I)\mathbf{v} = 0 \implies \mathbf{v_1} = [^2]^T$.
    - For $\lambda_2=3$: $(A - 3I)\mathbf{v} = 0 \implies \mathbf{v_2} = [^2][^2]^T$.
3. **Form $X$ and $V$:**

$$
X = \begin{bmatrix}
1 & 1 \\
0 & 1 
\end{bmatrix}, \quad
V = \begin{bmatrix}
2 & 0 \\
0 & 3 
\end{bmatrix}
$$
4. **Verify $A = XVX^{-1}$:**
    - $X^{-1} = \begin{bmatrix} 1 & -1 \\ 0 & 1 \end{bmatrix}$,

$$
XVX^{-1} = \begin{bmatrix}
1 & 1 \\
0 & 1 
\end{bmatrix}
\begin{bmatrix}
2 & 0 \\
0 & 3 
\end{bmatrix}
\begin{bmatrix}
1 & -1 \\
0 & 1 
\end{bmatrix} = 
\begin{bmatrix}
2 & 1 \\
0 & 3 
\end{bmatrix} = A.
$$

---

### 5. **Singular Value Decomposition (UΣVᵀ)**

**Objective:** Factorize $A$ as $A = U\Sigma V^T$ where $U$ and $V$ are orthogonal, and $\Sigma$ is diagonal.
**Example Matrix:**

$$
A = \begin{bmatrix}
1 & 0 \\
0 & 1 \\
1 & 0 
\end{bmatrix}
$$

**Steps:**

1. **Compute $A^TA$ and $AA^T$:**

$$
A^TA = \begin{bmatrix}
2 & 0 \\
0 & 1 
\end{bmatrix}, \quad
AA^T = \begin{bmatrix}
1 & 0 & 1 \\
0 & 1 & 0 \\
1 & 0 & 1 
\end{bmatrix}.
$$
2. **Find Eigenvectors of $A^TA$ for $V$:**
    - Eigenvalues: $\lambda_1=2, \lambda_2=1$.
    - Eigenvectors: $\mathbf{v_1} = [^2]^T$, $\mathbf{v_2} = [^2]^T$.

$$
V = \begin{bmatrix}
1 & 0 \\
0 & 1 
\end{bmatrix}
$$
3. **Compute $\Sigma$:**

$$
\Sigma = \begin{bmatrix}
\sqrt{2} & 0 \\
0 & 1 \\
0 & 0 
\end{bmatrix}
$$
4. **Find $U$ from $AA^T$:**
    - For $\sigma_1 = \sqrt{2}$: $\mathbf{u_1} = \frac{1}{\sqrt{2}}[^2][^2]^T$.
    - For $\sigma_2 = 1$: $\mathbf{u_2} = [^2]^T$.
    - $\mathbf{u_3}$ (null space): $[-1, 0, 1]^T$ (normalize to $[-\frac{1}{\sqrt{2}}, 0, \frac{1}{\sqrt{2}}]^T$).

$$
U = \begin{bmatrix}
\frac{1}{\sqrt{2}} & 0 & -\frac{1}{\sqrt{2}} \\
0 & 1 & 0 \\
\frac{1}{\sqrt{2}} & 0 & \frac{1}{\sqrt{2}}
\end{bmatrix}
$$
5. **Verify $A = U\Sigma V^T$:**

$$
U\Sigma V^T = \begin{bmatrix}
\frac{1}{\sqrt{2}} & 0 & -\frac{1}{\sqrt{2}} \\
0 & 1 & 0 \\
\frac{1}{\sqrt{2}} & 0 & \frac{1}{\sqrt{2}}
\end{bmatrix}
\begin{bmatrix}
\sqrt{2} & 0 \\
0 & 1 \\
0 & 0 
\end{bmatrix}
\begin{bmatrix}
1 & 0 \\
0 & 1 
\end{bmatrix}^T = A.
$$

---

## Key Insights

- **LU Decomposition:** Solves linear systems efficiently (e.g., $Ax = b$).
- **QR Decomposition:** Used in least-squares problems and eigenvalue algorithms.
- **Eigendecompositions:** Reveal matrix invariants (symmetric: spectral theorem; general: diagonalization).
- **SVD:** Generalizes eigendecomposition to non-square matrices, fundamental in data compression (PCA) and noise reduction.

Each decomposition provides unique insights into matrix structure and enables optimized numerical solutions.

<div style="text-align: center">⁂</div>

[^1]: Electronics-and-Communication-Engineering-1.pdf

[^2]: help-me-develop-a-comprehensiv-QXS7DMEKTi.b_oODNs2cEA.md

[^3]: AI-DS.pdf

