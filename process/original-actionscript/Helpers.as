package
{
	import flash.text.TextField;
	import flash.text.TextFormat;
	
	public class Helpers
	{
		
	
		
		public function Helpers()
		{
		}
		
		public static function makeTextField(x:uint, y:uint, w:uint, h:uint, s:String, tf:TextFormat):TextField {
						
			var textField:TextField = new TextField();
			textField.x = x * Globals.ZOOM;
			textField.y = y * Globals.ZOOM;
			textField.width = w * Globals.ZOOM;
			textField.height = h * Globals.ZOOM;
			textField.defaultTextFormat = tf;
			textField.text = s;
			textField.wordWrap = true;
			textField.selectable = false;
			textField.embedFonts = true;
			
			return textField;
		}
		
	}
}