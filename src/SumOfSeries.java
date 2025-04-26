import java.io.*;
import java.util.*;

class SumOfSeries {
    // Function to find sum of series 1 + 2 + ... + n
    static long seriesSum(int n) {
        // Using the formula: sum = n*(n+1)/2
        return (long)n * (n + 1) / 2;
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        // For manual testing
        System.out.println("Enter the value of n:");
        int n = scanner.nextInt();
        
        System.out.println("Sum of series from 1 to " + n + " is: " + seriesSum(n));
        
        // Examples
        System.out.println("\nExample test cases:");
        System.out.println("seriesSum(1) = " + seriesSum(1));   // Should be 1
        System.out.println("seriesSum(5) = " + seriesSum(5));   // Should be 15
        System.out.println("seriesSum(10) = " + seriesSum(10)); // Should be 55
        
        scanner.close();
    }
} 