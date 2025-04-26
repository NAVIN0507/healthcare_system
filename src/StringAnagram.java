import java.io.*;
import java.util.*;

public class StringAnagram {
    public static List<Integer> stringAnagram(List<String> dictionary, List<String> query) {
        // Result list to store counts
        List<Integer> result = new ArrayList<>();
        
        // Preprocess dictionary - sort characters of each word
        Map<String, Integer> sortedDictionary = new HashMap<>();
        
        for (String word : dictionary) {
            String sortedWord = sortString(word);
            sortedDictionary.put(sortedWord, sortedDictionary.getOrDefault(sortedWord, 0) + 1);
        }
        
        // Process each query
        for (String q : query) {
            String sortedQuery = sortString(q);
            // Add count to result (0 if no anagrams found)
            result.add(sortedDictionary.getOrDefault(sortedQuery, 0));
        }
        
        return result;
    }
    
    // Helper method to sort characters in a string
    private static String sortString(String s) {
        char[] chars = s.toCharArray();
        Arrays.sort(chars);
        return new String(chars);
    }
    
    public static void main(String[] args) {
        // Example test case
        List<String> dictionary = Arrays.asList("hack", "a", "rank", "khac", "ackh", "kran", "ranK", "aa", "aaa");
        List<String> query = Arrays.asList("a", "nark", "bs", "hack", "rank");
        
        List<Integer> result = stringAnagram(dictionary, query);
        
        System.out.println("Query strings: " + query);
        System.out.println("Anagram counts: " + result);
        
        // Expected output: [1, 1, 0, 3, 2]
        // a → 1 occurrence in dictionary
        // nark → 1 occurrence (kran)
        // bs → 0 occurrences
        // hack → 3 occurrences (hack, khac, ackh)
        // rank → 2 occurrences (rank, kran)
    }
} 