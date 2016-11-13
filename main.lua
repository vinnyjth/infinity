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

error_state = 0

function led(r, g, b)
    pwm.setduty(green, g)
    pwm.setduty(blue, b)
    pwm.setduty(red, r)
end

led(512, 0, 0)

function flash_error()
    if error_state == 0 then
        led(512, 0, 0)
        error_state = 1
    else
        led(512, 0, 0)
        error_state = 0
    end
end


m = mqtt.Client("lightstrip-infinity", 120, "", "")

m:lwt("/lwt", "offline", 0, 0)

function reconnect()
    print("Waiting for wifi")
     if wifi.sta.status() == 5 and wifi.sta.getip() ~= nil then
        print("Wifi Up")
        m:connect("192.168.51.73", 1883, 0,
            function(client, reason)
                tmr.stop(1)
                tmr.stop(2)
                print("Reconnected")
                on_subscribe()
            end,
            function(client, reason)
                print("failed reason: "..reason)
            end
        )
    end
end

m:on("connect", function(client) print ("connected") end)
m:on("offline", function(client)
    print ("offline")
    tmr.alarm(1, 10000, tmr.ALARM_AUTO, function()
        reconnect()
    end)
    tmr.alarm(2, 2000, tmr.ALARM_AUTO, function()
        flash_error()
    end)
end)

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
