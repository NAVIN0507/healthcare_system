import java.io.*;
import java.util.*;

public class MaximumCostLaptop {
    public static int maxCost(List<Integer> cost, List<String> labels, int dailyCount) {
        int n = cost.size();
        int maxCost = 0;
        int currentCost = 0;
        int legalCount = 0;
        
        // Iterate through the manufacturing process
        for (int i = 0; i < n; i++) {
            currentCost += cost.get(i); // Add cost of current laptop
            
            // Count legal laptops
            if (labels.get(i).equals("legal")) {
                legalCount++;
            }
            
            // If we've met the daily quota
            if (legalCount == dailyCount) {
                // Update max cost if current day's cost is higher
                maxCost = Math.max(maxCost, currentCost);
                
                // Reset for the next day
                currentCost = 0;
                legalCount = 0;
            }
        }
        
        // If we couldn't meet the daily count, return 0
        return maxCost;
    }
    
    public static void main(String[] args) {
        // Example test case
        List<Integer> cost = Arrays.asList(2, 5, 3, 11, 1);
        List<String> labels = Arrays.asList("legal", "illegal", "legal", "illegal", "legal");
        int dailyCount = 2;
        
        int result = maxCost(cost, labels, dailyCount);
        
        System.out.println("Maximum cost: " + result);
        
        // Expected output: 16
        // Explanation:
        // Day 1: Process laptops at indices 0, 1, 2 with costs 2, 5, 3
        //        2 legal laptops (indices 0, 2), total cost = 2+5+3 = 10
        // Day 2: Process laptops at indices 3, 4 with costs 11, 1
        //        1 legal laptop (index 4), not enough to meet daily count
        // 
        // Since only Day 1 met the daily count, max cost is 10
        
        // Additional test case
        cost = Arrays.asList(3, 6, 2, 4, 1, 10, 5);
        labels = Arrays.asList("legal", "legal", "illegal", "legal", "legal", "illegal", "legal");
        dailyCount = 3;
        
        result = maxCost(cost, labels, dailyCount);
        System.out.println("Maximum cost: " + result);
        
        // Second test case with 2 days
        cost = Arrays.asList(4, 3, 2, 1, 5, 6, 9, 10, 8);
        labels = Arrays.asList("legal", "illegal", "legal", "illegal", "legal", "legal", "legal", "legal", "legal");
        dailyCount = 2;
        
        result = maxCost(cost, labels, dailyCount);
        System.out.println("Maximum cost (second test): " + result);
    }
} 