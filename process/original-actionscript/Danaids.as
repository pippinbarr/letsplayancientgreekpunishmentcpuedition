package
{

	import flash.events.KeyboardEvent;
	import flash.sampler.startSampling;
	import flash.text.*;
	import flash.ui.Keyboard;

	import org.flixel.*;

	public class Danaids extends FlxState {

		[Embed(source="assets/sprites/danaids/danaid.png")]
		private const DANAID_ANIMATION:Class;

		[Embed(source="assets/sprites/danaids/bath.png")]
		private const BATH_ANIMATION:Class;

		[Embed(source="assets/sprites/danaids/tap.png")]
		private const TAP_ANIMATION:Class;

		[Embed(source="assets/sprites/danaids/ground.png")]
		private const GROUND_SPRITE:Class;

		[Embed(source="assets/fonts/Commodore Pixelized v1.2.ttf", fontName="COMMODORE", fontWeight="Regular", embedAsCFF="false")]
		public static const COMMODORE_FONT:Class;

		private const BETWEEN:uint = 0;
		private const FILLING:uint = 1;
		private const DONEFILLING:uint = 6;
		private const TOFILL:uint = 2;
		private const TOPOUR:uint = 3;
		private const POURING:uint = 4;
		private const IDLE:uint = 5;
		private const BATHDRAINING:uint = 7;

		private const MAX_KEY_DELAY:Number = 0.15;

		private const DANAID_IDLE_FRAMES:Array = new Array(
			3,3
		);
		private const DANAID_RUNNING_FRAMES:Array = new Array(
			0,1,2
		);
		private const DANAID_FILLING_FRAMES:Array = new Array(
			5,5
		);
		private const DANAID_UNFILLING_FRAMES:Array = new Array(
			4,4
		);
		private const DANAID_POURING_FRAMES:Array = new Array(
			4,5,6,7,8,9,9,9,9,9,8,7,6,5,4
		);
		private const TAP_NO_BUCKET_FRAMES:Array = new Array(
			0,1,2
		);
		private const TAP_BUCKET_FRAMES:Array = new Array(
			3,3
		);
		private const TAP_BUCKET_REMOVED_FRAMES:Array = new Array(
			4,5
		);
		private const BATH_IDLE_FRAMES:Array = new Array(
			0
		);
		private const BATH_POURING_FRAMES:Array = new Array(
			0,1,2
		);
		private const BATH_DRAINING_FRAMES:Array = new Array(
			3,4,5,6,7,0
		);

		private const TAP_STOP_X:int = -2;
		private const BATH_STOP_X:uint = 155;

		private var _danaid:FlxSprite;
		private var _tap:FlxSprite;
		private var _bath:FlxSprite;
		private var _ground:FlxSprite;

		private const BATH_PREFIX:String = "BATH FULL: ";
		private var _bathFullPercentage:uint = 0;
		private var _bathText:TextField;
		private var _textFormat:TextFormat = new TextFormat("COMMODORE",24,0xFFFFFF,null,null,null,null,null,"left");

		private var _instructionsText:TextField;
		private var _instructionsTextFormat:TextFormat = new TextFormat("COMMODORE",24,0x000000,null,null,null,null,null,"center");
		private const INSTRUCTIONS_TEXT:String = "RAPIDLY ALTERNATE THE 'G' AND 'H' KEYS TO FILL YOUR BUCKET AND THEN FILL THE BATH TO WASH AWAY YOUR SINS!";

		private var _lastKey:uint = Keyboard.H;
		private var _frameCount:uint = 0;
		private var _keyCount:uint = 0;

		private var _currentFrame:int = 0;

		private var _timer:FlxTimer;
		private var _timeSincePress:Number = 100;
		private var _pressed:Boolean = false;
		private var _fillTime:Number = 0;
		private const FILL_TIME:uint = 2;

		private var _bathFilling:Boolean = false;

		private var _state:uint = TOFILL;

		public function Danaids() {
		}

		public override function create():void {

			FlxG.bgColor = 0xFFDDDDAA;

			_timer = new FlxTimer();

			_danaid = new FlxSprite();
			_danaid.loadGraphic(DANAID_ANIMATION,true,true,20,20);
			_danaid.addAnimation("idle",DANAID_IDLE_FRAMES,5,false);
			_danaid.addAnimation("run",DANAID_RUNNING_FRAMES,5,true);
			_danaid.addAnimation("fill",DANAID_FILLING_FRAMES,5,false);
			_danaid.addAnimation("unfill",DANAID_UNFILLING_FRAMES,5,false);
			_danaid.addAnimation("pour",DANAID_POURING_FRAMES,5,false);
			_danaid.x = 50; _danaid.y = 60;
			_danaid.facing = FlxObject.LEFT;

			_tap = new FlxSprite();
			_tap.loadGraphic(TAP_ANIMATION,true,false,10,18);
			_tap.addAnimation("idle",TAP_NO_BUCKET_FRAMES,5,true);
			_tap.addAnimation("bucket",TAP_BUCKET_FRAMES,5,true);
			_tap.addAnimation("bucketremoved",TAP_BUCKET_REMOVED_FRAMES,5,false);
			_tap.x = 0; _tap.y = 61;

			_bath = new FlxSprite();
			_bath.loadGraphic(BATH_ANIMATION,true,false,20,12);
			_bath.addAnimation("idle",BATH_IDLE_FRAMES,5,true);
			_bath.addAnimation("pouring",BATH_POURING_FRAMES,5,false);
			_bath.addAnimation("draining",BATH_DRAINING_FRAMES,10,false);
			_bath.x = 170; _bath.y = 67;

			_ground = new FlxSprite();
			_ground.loadGraphic(GROUND_SPRITE);
			_ground.x = 0; _ground.y = 0;

			_bathText = Helpers.makeTextField(118,87,FlxG.width,FlxG.height,BATH_PREFIX + _bathFullPercentage.toString() + "%",_textFormat);

			_instructionsText = Helpers.makeTextField(50,20,FlxG.width - 100,FlxG.height,INSTRUCTIONS_TEXT,_instructionsTextFormat);

			this.add(_tap);
			this.add(_danaid);
			this.add(_bath);
			this.add(_ground);

			_tap.play("idle");
			_danaid.play("idle");
			_bath.play("idle");

			FlxG.stage.addChild(_bathText);
			FlxG.stage.addChild(_instructionsText);

			FlxG.stage.addEventListener(KeyboardEvent.KEY_DOWN,onKeyDown);

			super.create();

		}


		public override function update():void {

			_timeSincePress += FlxG.elapsed;

			if (_pressed) {

				if (_state == DONEFILLING) {
					_state = IDLE;
					_danaid.play("unfill");
					_tap.play("idle");
					_timer.start(1,1,fillToPour);
				}
				else if (_state == FILLING) {
					_fillTime += FlxG.elapsed;
					if (_fillTime < FILL_TIME) {
						_danaid.play("fill");
						_tap.play("bucket");
					}
					else {
						_fillTime = 0;
						_state = DONEFILLING;
					}
				}
				else if (_state == TOFILL) {
					_danaid.play("run");
					_danaid.x -= 0.3;
				}
				else if (_state == TOPOUR) {
					_danaid.play("run");
					_danaid.x += 0.3;
				}

			}
			else {
				if (_state != POURING) {
					_danaid.play("idle");
					_tap.play("idle");
				}
			}

			if (_state == POURING) {
				if (_danaid.frame == 9 && !_bathFilling) {
					_bathFilling = true;
					_bath.play("pouring");
					Assets.swoopUp.volume = 1;
					Assets.swoopUp.play();
				}
				if (_danaid.frame == 9 && _bathFullPercentage < 20) {
					this._bathFullPercentage += 1;
					this._bathText.text = this.BATH_PREFIX + this._bathFullPercentage.toString() + "%";
				}
				if (_danaid.finished) {
					if (FlxG.stage.contains(_instructionsText)) {
						FlxG.stage.removeChild(_instructionsText);
						FlxG.stage.focus = null;
					}
					_bathFilling = false;
					_state = BATHDRAINING;
					_bath.play("draining");
					Assets.swoopDown.volume = 1;
					Assets.swoopDown.play();
					_timer.start(1,1,pourToFill);
				}
			}
			if (_tap.finished && _state == IDLE) {
				_tap.play("idle");
			}
			if (_state == BATHDRAINING && _bathFullPercentage > 0) {
				this._bathFullPercentage -= 1;
				this._bathText.text = this.BATH_PREFIX + this._bathFullPercentage.toString() + "%";
			}

			if (_danaid.x <= TAP_STOP_X && _state != FILLING && _state != IDLE && _state != DONEFILLING) {
				_state = FILLING;
				_danaid.play("fill");
				_tap.play("bucket");
			}
			else if (_danaid.x >= BATH_STOP_X && _state != POURING && _state != IDLE && _state != BATHDRAINING && _state != TOFILL) {
				_state = POURING;
				_danaid.play("pour");
			}

			_currentFrame = _danaid.frame;

			if (_timeSincePress > MAX_KEY_DELAY) _pressed = false;

			super.update();

		}



		private function fillToPour(t:FlxTimer):void {

			_danaid.facing = FlxObject.RIGHT;
			_danaid.x += 4;
			_state = TOPOUR;

		}


		private function pourToFill(t:FlxTimer):void {

			_danaid.facing = FlxObject.LEFT;
			_danaid.x -= 4;
			_state = TOFILL;

		}


		private function onKeyDown(e:KeyboardEvent):void {

			if (e.keyCode == Keyboard.G && _lastKey == Keyboard.H) {
				_pressed = (_timeSincePress <= MAX_KEY_DELAY);
				_timeSincePress = 0;
				_lastKey = e.keyCode;

			}
			else if (e.keyCode == Keyboard.H && _lastKey == Keyboard.G) {
				_pressed = (_timeSincePress <= MAX_KEY_DELAY);
				_timeSincePress = 0;
				_lastKey = e.keyCode;

			}
			else if (e.keyCode == Keyboard.ESCAPE) {
				FlxG.switchState(new Menu);
			}

			trace(_pressed);


		}


		public override function destroy():void {

			if (_danaid) _danaid.destroy();
			if (_tap) _tap.destroy();
			if (_bath) _bath.destroy();
			if (_ground) _ground.destroy();

			if (_bathText && FlxG.stage.contains(_bathText)) FlxG.stage.removeChild(_bathText);
			if (_instructionsText && FlxG.stage.contains(_instructionsText)) FlxG.stage.removeChild(_instructionsText);

			FlxG.stage.removeEventListener(KeyboardEvent.KEY_DOWN,onKeyDown);

			super.destroy();

		}

	}
}
