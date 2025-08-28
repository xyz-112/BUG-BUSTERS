package sistec;

    public class HighestMarks {

        public static int findHighestMarks(int[] marks) {
            if (marks == null || marks.length == 0) {
                throw new IllegalArgumentException("Marks array cannot be null or empty.");
            }

            int max = marks[0];
            for (int i = 1; i < marks.length; i++) {
                if (marks[i] > max) {
                    max = marks[i];
                }
            }
            return max;
        }

        public static void main(String[] args) {
            int[] marks = {78, 85, 92, 67, 88};
            int highest = findHighestMarks(marks);
            System.out.println("Highest marks: " + highest);
        }
    }


