red = 2
blue = 1
green = 4
gpio.mode(2, gpio.OUTPUT)
gpio.mode(5, gpio.OUTPUT)
gpio.mode(4, gpio.OUTPUT)

pwm.setup(red, 1000, 0)
pwm.setup(blue, 1000, 0)
pwm.setup(green, 1000, 0)

pwm.start(red)
pwm.start(blue)
pwm.start(green)

function led(r, g, b)
    pwm.setduty(green, g)
    pwm.setduty(blue, b)
    pwm.setduty(red, r)
end

led(512, 0, 0)

m = mqtt.Client("lightstrip-infinity", 120, "", "")

m:lwt("/lwt", "offline", 0, 0)

m:on("connect", function(client) print ("connected") end)
m:on("offline", function(client) print ("offline") end)

m:on("message", function(client, topic, data)
  print(topic .. ":" )
  if data ~= nil then
    local color = {}
    for k, v in string.gmatch(data, "(%a+):(%d+)") do
        color[k] = v;
    end
    r,g,b = color['r'], color['g'], color['b']
    print(r, g, b)
    if r ~= nil and g ~= nil and b ~= nil then
        led(r, g, b)
--        m:publish("/vanity_lights", "recieved r" .. r .. " g" .. g .. " b"  .. b, 0, 0)
    end
  end
end)

function on_subscribe()
    m:subscribe("/vanity_lights",0, function(client) print("subscribe success") end)
end

m:connect("192.168.51.73", 1883, 0, on_subscribe,
                                     function(client, reason) print("failed reason: "..reason) end)
