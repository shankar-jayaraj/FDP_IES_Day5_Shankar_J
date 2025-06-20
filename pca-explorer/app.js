// PCA Interactive Demo Application
class PCADemo {
    constructor() {
        this.data = null;
        this.pcaResults = null;
        this.colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'];
        this.currentPCX = 0;
        this.currentPCY = 1;
        
        this.initializeControls();
        this.generateInitialData();
    }

    initializeControls() {
        // Slider controls
        const clustersSlider = document.getElementById('clusters');
        const samplesSlider = document.getElementById('samples');
        const noiseSlider = document.getElementById('noise');
        
        clustersSlider.addEventListener('input', (e) => {
            document.getElementById('clusters-value').textContent = e.target.value;
        });
        
        samplesSlider.addEventListener('input', (e) => {
            document.getElementById('samples-value').textContent = e.target.value;
        });
        
        noiseSlider.addEventListener('input', (e) => {
            document.getElementById('noise-value').textContent = e.target.value;
        });
        
        // Generate data button
        document.getElementById('generate-data').addEventListener('click', () => {
            this.generateNewData();
        });
        
        // PC selection dropdowns
        document.getElementById('pc-x').addEventListener('change', (e) => {
            this.currentPCX = parseInt(e.target.value);
            this.updatePCA2D();
        });
        
        document.getElementById('pc-y').addEventListener('change', (e) => {
            this.currentPCY = parseInt(e.target.value);
            this.updatePCA2D();
        });
    }

    generateInitialData() {
        this.generateNewData();
    }

    generateNewData() {
        const clusters = parseInt(document.getElementById('clusters').value);
        const samples = parseInt(document.getElementById('samples').value);
        const noise = parseFloat(document.getElementById('noise').value);
        
        this.data = this.generateSyntheticData(clusters, samples, noise);
        this.pcaResults = this.performPCA(this.data.points);
        
        this.updateAllVisualizations();
    }

    generateSyntheticData(numClusters, samplesPerCluster, noiseLevel) {
        const data = { points: [], clusters: [] };
        const clusterCenters = [];
        
        // Generate cluster centers
        for (let i = 0; i < numClusters; i++) {
            clusterCenters.push([
                Math.random() * 10 - 5,
                Math.random() * 10 - 5,
                Math.random() * 10 - 5
            ]);
        }
        
        // Generate points for each cluster
        for (let cluster = 0; cluster < numClusters; cluster++) {
            const center = clusterCenters[cluster];
            
            for (let i = 0; i < samplesPerCluster; i++) {
                const point = [
                    center[0] + (Math.random() - 0.5) * noiseLevel * 4,
                    center[1] + (Math.random() - 0.5) * noiseLevel * 4,
                    center[2] + (Math.random() - 0.5) * noiseLevel * 4
                ];
                
                data.points.push(point);
                data.clusters.push(cluster);
            }
        }
        
        return data;
    }

    performPCA(data) {
        const n = data.length;
        const p = data[0].length;
        
        // Center the data
        const means = [];
        for (let j = 0; j < p; j++) {
            means[j] = data.reduce((sum, row) => sum + row[j], 0) / n;
        }
        
        const centeredData = data.map(row => 
            row.map((val, j) => val - means[j])
        );
        
        // Compute covariance matrix
        const covMatrix = this.computeCovarianceMatrix(centeredData);
        
        // Compute eigenvalues and eigenvectors
        const eigen = this.eigenDecomposition(covMatrix);
        
        // Sort by eigenvalues (descending)
        const sortedIndices = eigen.values
            .map((val, idx) => ({ val, idx }))
            .sort((a, b) => b.val - a.val)
            .map(item => item.idx);
        
        const eigenvalues = sortedIndices.map(idx => eigen.values[idx]);
        const eigenvectors = sortedIndices.map(idx => eigen.vectors[idx]);
        
        // Project data onto principal components
        const projectedData = centeredData.map(row => {
            return eigenvectors.map(vec => 
                row.reduce((sum, val, idx) => sum + val * vec[idx], 0)
            );
        });
        
        // Calculate explained variance
        const totalVariance = eigenvalues.reduce((sum, val) => sum + val, 0);
        const explainedVariance = eigenvalues.map(val => val / totalVariance);
        const cumulativeVariance = explainedVariance.reduce((acc, val, idx) => {
            acc.push((acc[idx - 1] || 0) + val);
            return acc;
        }, []);
        
        return {
            eigenvalues,
            eigenvectors,
            projectedData,
            explainedVariance,
            cumulativeVariance,
            centeredData,
            means
        };
    }

    computeCovarianceMatrix(data) {
        const n = data.length;
        const p = data[0].length;
        const cov = Array(p).fill().map(() => Array(p).fill(0));
        
        for (let i = 0; i < p; i++) {
            for (let j = 0; j < p; j++) {
                let sum = 0;
                for (let k = 0; k < n; k++) {
                    sum += data[k][i] * data[k][j];
                }
                cov[i][j] = sum / (n - 1);
            }
        }
        
        return cov;
    }

    eigenDecomposition(matrix) {
        // Simplified eigenvalue decomposition using power iteration
        const n = matrix.length;
        const eigenvalues = [];
        const eigenvectors = [];
        
        // For 3x3 matrix, we can use analytical solutions or iterative methods
        // Here's a simplified approach for the demo
        for (let i = 0; i < n; i++) {
            const { value, vector } = this.powerIteration(matrix);
            eigenvalues.push(value);
            eigenvectors.push(vector);
            
            // Deflate the matrix
            matrix = this.deflateMatrix(matrix, value, vector);
        }
        
        return { values: eigenvalues, vectors: eigenvectors };
    }

    powerIteration(matrix, maxIterations = 100) {
        const n = matrix.length;
        let vector = Array(n).fill().map(() => Math.random());
        
        // Normalize
        let norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
        vector = vector.map(val => val / norm);
        
        for (let iter = 0; iter < maxIterations; iter++) {
            // Multiply matrix by vector
            const newVector = Array(n).fill(0);
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    newVector[i] += matrix[i][j] * vector[j];
                }
            }
            
            // Calculate eigenvalue
            const eigenvalue = newVector.reduce((sum, val, idx) => sum + val * vector[idx], 0);
            
            // Normalize
            norm = Math.sqrt(newVector.reduce((sum, val) => sum + val * val, 0));
            vector = newVector.map(val => val / norm);
        }
        
        const eigenvalue = vector.reduce((sum, val, idx) => 
            sum + val * matrix[idx].reduce((s, mval, j) => s + mval * vector[j], 0), 0
        );
        
        return { value: Math.abs(eigenvalue), vector };
    }

    deflateMatrix(matrix, eigenvalue, eigenvector) {
        const n = matrix.length;
        const deflated = Array(n).fill().map(() => Array(n).fill(0));
        
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                deflated[i][j] = matrix[i][j] - eigenvalue * eigenvector[i] * eigenvector[j];
            }
        }
        
        return deflated;
    }

    updateAllVisualizations() {
        this.render3DScatter();
        this.renderPCA2D();
        this.renderScreePlot();
        this.renderVariancePlot();
        this.renderResultsTable();
    }

    updatePCA2D() {
        this.renderPCA2D();
    }

    render3DScatter() {
        const container = d3.select('#original-3d');
        container.selectAll('*').remove();
        
        const width = 380;
        const height = 300;
        const margin = { top: 20, right: 20, bottom: 20, left: 20 };
        
        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height);
        
        // Simple 3D to 2D projection
        const project3D = (point) => {
            const [x, y, z] = point;
            return [
                x * 20 + z * 10,
                y * 20 - z * 5
            ];
        };
        
        const xExtent = d3.extent(this.data.points, d => project3D(d)[0]);
        const yExtent = d3.extent(this.data.points, d => project3D(d)[1]);
        
        const xScale = d3.scaleLinear()
            .domain(xExtent)
            .range([margin.left, width - margin.right]);
        
        const yScale = d3.scaleLinear()
            .domain(yExtent)
            .range([height - margin.bottom, margin.top]);
        
        const tooltip = this.createTooltip();
        
        svg.selectAll('circle')
            .data(this.data.points)
            .enter()
            .append('circle')
            .attr('cx', d => xScale(project3D(d)[0]))
            .attr('cy', d => yScale(project3D(d)[1]))
            .attr('r', 4)
            .attr('fill', (d, i) => this.colors[this.data.clusters[i]])
            .attr('class', 'data-point')
            .on('mouseover', (event, d, i) => {
                const clusterIndex = this.data.clusters[this.data.points.indexOf(d)];
                tooltip.transition().duration(200).style('opacity', 1);
                tooltip.html(`Cluster: ${clusterIndex}<br/>Point: (${d.map(v => v.toFixed(2)).join(', ')})`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
            })
            .on('mouseout', () => {
                tooltip.transition().duration(200).style('opacity', 0);
            });
    }

    renderPCA2D() {
        const container = d3.select('#pca-2d');
        container.selectAll('*').remove();
        
        const width = 380;
        const height = 300;
        const margin = { top: 20, right: 20, bottom: 40, left: 50 };
        
        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height);
        
        const xData = this.pcaResults.projectedData.map(d => d[this.currentPCX]);
        const yData = this.pcaResults.projectedData.map(d => d[this.currentPCY]);
        
        const xScale = d3.scaleLinear()
            .domain(d3.extent(xData))
            .range([margin.left, width - margin.right]);
        
        const yScale = d3.scaleLinear()
            .domain(d3.extent(yData))
            .range([height - margin.bottom, margin.top]);
        
        // Add axes
        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale).ticks(5))
            .attr('class', 'axis');
        
        svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale).ticks(5))
            .attr('class', 'axis');
        
        // Add axis labels
        svg.append('text')
            .attr('transform', `translate(${width/2},${height - 5})`)
            .style('text-anchor', 'middle')
            .style('font-size', '12px')
            .text(`PC${this.currentPCX + 1} (${(this.pcaResults.explainedVariance[this.currentPCX] * 100).toFixed(1)}%)`);
        
        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 15)
            .attr('x', -height/2)
            .style('text-anchor', 'middle')
            .style('font-size', '12px')
            .text(`PC${this.currentPCY + 1} (${(this.pcaResults.explainedVariance[this.currentPCY] * 100).toFixed(1)}%)`);
        
        const tooltip = this.createTooltip();
        
        svg.selectAll('circle')
            .data(this.pcaResults.projectedData)
            .enter()
            .append('circle')
            .attr('cx', d => xScale(d[this.currentPCX]))
            .attr('cy', d => yScale(d[this.currentPCY]))
            .attr('r', 4)
            .attr('fill', (d, i) => this.colors[this.data.clusters[i]])
            .attr('class', 'data-point')
            .on('mouseover', (event, d, i) => {
                const clusterIndex = this.data.clusters[i];
                tooltip.transition().duration(200).style('opacity', 1);
                tooltip.html(`Cluster: ${clusterIndex}<br/>PC${this.currentPCX + 1}: ${d[this.currentPCX].toFixed(2)}<br/>PC${this.currentPCY + 1}: ${d[this.currentPCY].toFixed(2)}`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
            })
            .on('mouseout', () => {
                tooltip.transition().duration(200).style('opacity', 0);
            });
    }

    renderScreePlot() {
        const container = d3.select('#scree-plot');
        container.selectAll('*').remove();
        
        const width = 380;
        const height = 300;
        const margin = { top: 20, right: 20, bottom: 40, left: 50 };
        
        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height);
        
        const xScale = d3.scaleBand()
            .domain(this.pcaResults.eigenvalues.map((d, i) => `PC${i + 1}`))
            .range([margin.left, width - margin.right])
            .padding(0.2);
        
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(this.pcaResults.eigenvalues)])
            .range([height - margin.bottom, margin.top]);
        
        // Add axes
        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale))
            .attr('class', 'axis');
        
        svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale).ticks(5))
            .attr('class', 'axis');
        
        // Add axis labels
        svg.append('text')
            .attr('transform', `translate(${width/2},${height - 5})`)
            .style('text-anchor', 'middle')
            .style('font-size', '12px')
            .text('Principal Components');
        
        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 15)
            .attr('x', -height/2)
            .style('text-anchor', 'middle')
            .style('font-size', '12px')
            .text('Eigenvalue');
        
        const tooltip = this.createTooltip();
        
        svg.selectAll('.scree-bar')
            .data(this.pcaResults.eigenvalues)
            .enter()
            .append('rect')
            .attr('class', 'scree-bar')
            .attr('x', (d, i) => xScale(`PC${i + 1}`))
            .attr('y', d => yScale(d))
            .attr('width', xScale.bandwidth())
            .attr('height', d => height - margin.bottom - yScale(d))
            .on('mouseover', (event, d, i) => {
                tooltip.transition().duration(200).style('opacity', 1);
                tooltip.html(`PC${i + 1}<br/>Eigenvalue: ${d.toFixed(3)}<br/>Explained Variance: ${(this.pcaResults.explainedVariance[i] * 100).toFixed(1)}%`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
            })
            .on('mouseout', () => {
                tooltip.transition().duration(200).style('opacity', 0);
            });
    }

    renderVariancePlot() {
        const container = d3.select('#variance-plot');
        container.selectAll('*').remove();
        
        const width = 380;
        const height = 300;
        const margin = { top: 20, right: 20, bottom: 40, left: 50 };
        
        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height);
        
        const xScale = d3.scaleLinear()
            .domain([1, this.pcaResults.cumulativeVariance.length])
            .range([margin.left, width - margin.right]);
        
        const yScale = d3.scaleLinear()
            .domain([0, 1])
            .range([height - margin.bottom, margin.top]);
        
        // Add axes
        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale).ticks(this.pcaResults.cumulativeVariance.length).tickFormat(d => `PC${d}`))
            .attr('class', 'axis');
        
        svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale).tickFormat(d3.format('.0%')))
            .attr('class', 'axis');
        
        // Add axis labels
        svg.append('text')
            .attr('transform', `translate(${width/2},${height - 5})`)
            .style('text-anchor', 'middle')
            .style('font-size', '12px')
            .text('Number of Components');
        
        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 15)
            .attr('x', -height/2)
            .style('text-anchor', 'middle')
            .style('font-size', '12px')
            .text('Cumulative Explained Variance');
        
        const line = d3.line()
            .x((d, i) => xScale(i + 1))
            .y(d => yScale(d))
            .curve(d3.curveMonotoneX);
        
        const area = d3.area()
            .x((d, i) => xScale(i + 1))
            .y0(yScale(0))
            .y1(d => yScale(d))
            .curve(d3.curveMonotoneX);
        
        // Add area
        svg.append('path')
            .datum(this.pcaResults.cumulativeVariance)
            .attr('class', 'variance-area')
            .attr('d', area);
        
        // Add line
        svg.append('path')
            .datum(this.pcaResults.cumulativeVariance)
            .attr('class', 'variance-line')
            .attr('d', line);
        
        const tooltip = this.createTooltip();
        
        // Add points
        svg.selectAll('.variance-point')
            .data(this.pcaResults.cumulativeVariance)
            .enter()
            .append('circle')
            .attr('class', 'variance-point')
            .attr('cx', (d, i) => xScale(i + 1))
            .attr('cy', d => yScale(d))
            .attr('r', 4)
            .on('mouseover', (event, d, i) => {
                tooltip.transition().duration(200).style('opacity', 1);
                tooltip.html(`${i + 1} Component${i > 0 ? 's' : ''}<br/>Cumulative Variance: ${(d * 100).toFixed(1)}%`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
            })
            .on('mouseout', () => {
                tooltip.transition().duration(200).style('opacity', 0);
            });
    }

    renderResultsTable() {
        const container = d3.select('#results-table');
        container.selectAll('*').remove();
        
        const tableDiv = container.append('div')
            .attr('class', 'results-table');
        
        const table = tableDiv.append('table');
        const thead = table.append('thead');
        const tbody = table.append('tbody');
        
        // Header
        thead.append('tr')
            .selectAll('th')
            .data(['Component', 'Eigenvalue', 'Explained Variance', 'Cumulative Variance'])
            .enter()
            .append('th')
            .text(d => d);
        
        // Rows
        const rows = tbody.selectAll('tr')
            .data(this.pcaResults.eigenvalues)
            .enter()
            .append('tr');
        
        rows.selectAll('td')
            .data((d, i) => [
                `PC${i + 1}`,
                d.toFixed(4),
                `${(this.pcaResults.explainedVariance[i] * 100).toFixed(2)}%`,
                `${(this.pcaResults.cumulativeVariance[i] * 100).toFixed(2)}%`
            ])
            .enter()
            .append('td')
            .text(d => d);
    }

    createTooltip() {
        return d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentloaded', () => {
    new PCADemo();
});

// Initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PCADemo();
    });
} else {
    new PCADemo();
}