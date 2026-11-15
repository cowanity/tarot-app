import unittest
from check_numberLens import validate

class NumberLensTests(unittest.TestCase):
    def rows(self):
        return [dict(number=n, essence='Một ý để tự quan sát.', gift='Một điểm có thể nâng đỡ.', shadow='Một điều đáng để ý.', question='Bạn muốn tìm hiểu điều gì?') for n in range(1, 12)]
    def test_valid(self):
        self.assertEqual(validate(self.rows()), [])
    def test_reject_invalid(self):
        for field, value in [('essence', 'may mắn.'), ('shadow', 'XUI.'), ('gift', 'Chắc chắn.'), ('essence', 'a'*221+'.'), ('question', 'Không hỏi.'), ('gift', 'Một câu. Hai câu.')]:
            rows=self.rows();rows[0][field]=value
            self.assertTrue(validate(rows))
    def test_missing_duplicate_placeholder(self):
        self.assertTrue(validate(self.rows()[:-1]))
        rows=self.rows(); rows[-1]['number']=1;self.assertTrue(validate(rows))
        rows=self.rows(); rows[0]['_placeholder']=True;self.assertTrue(validate(rows))
    def test_wrong_types(self):
        self.assertTrue(validate({}));rows=self.rows();rows[0]['number']=True;self.assertTrue(validate(rows))

if __name__ == '__main__': unittest.main()
